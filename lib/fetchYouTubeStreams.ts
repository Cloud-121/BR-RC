import axios from 'axios';
import {
  YOUTUBE_CHANNEL_LIVE_URL,
  YOUTUBE_CHANNEL_STREAMS_URL,
  YOUTUBE_CHANNEL_URL,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
} from './youtubeChannel';
import {
  extractJsonAssignment,
  isDurationBadge,
  videoIdFromThumbnailUrl,
} from './parseYoutubePage';

export type YouTubeStreamStatus = 'live' | 'upcoming' | 'completed';

export interface YouTubeStream {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string | null;
  scheduledStartTime: string | null;
  status: YouTubeStreamStatus;
  url: string;
  detailText?: string;
}

export interface YouTubeStreamsResult {
  channelUrl: string;
  live: YouTubeStream | null;
  upcoming: YouTubeStream[];
  past: YouTubeStream[];
}

export class YouTubeStreamsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'YouTubeStreamsError';
  }
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const FETCH_HEADERS = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.6',
  'cache-control': 'max-age=0',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

let streamsCache: { result: YouTubeStreamsResult; expiresAt: number } | null = null;

function getAxiosProxyOptions():
  | {
      proxy: {
        host: string;
        port: number;
        protocol: string;
        auth?: { username: string; password: string };
      };
    }
  | undefined {
  const proxyUrl = process.env.HTTP_PROXY;
  if (!proxyUrl) return undefined;

  try {
    const parsed = new URL(proxyUrl);
    return {
      proxy: {
        host: parsed.hostname,
        port: Number(parsed.port) || (parsed.protocol === 'https:' ? 443 : 80),
        protocol: parsed.protocol.replace(':', ''),
        auth:
          parsed.username && parsed.password
            ? { username: parsed.username, password: parsed.password }
            : undefined,
      },
    };
  } catch {
    return undefined;
  }
}

async function fetchHtml(url: string): Promise<string> {
  const proxyOptions = getAxiosProxyOptions();

  if (proxyOptions) {
    const response = await axios.get<string>(url, {
      headers: FETCH_HEADERS,
      ...proxyOptions,
    });
    return response.data;
  }

  const response = await fetch(url, { headers: FETCH_HEADERS, redirect: 'follow' });
  if (!response.ok) {
    throw new YouTubeStreamsError(`HTTP ${response.status} fetching ${url}`);
  }

  return response.text();
}

function getText(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return null;
  const obj = value as Record<string, unknown>;
  if (typeof obj.simpleText === 'string') return obj.simpleText;
  if (typeof obj.content === 'string') return obj.content;
  if (Array.isArray(obj.runs)) {
    return obj.runs
      .map((run) => (run && typeof run === 'object' ? (run as { text?: string }).text : ''))
      .filter(Boolean)
      .join('');
  }
  return null;
}

function walkObject(obj: unknown, visit: (value: Record<string, unknown>) => void): void {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item) => walkObject(item, visit));
    return;
  }

  const record = obj as Record<string, unknown>;
  visit(record);
  Object.values(record).forEach((value) => walkObject(value, visit));
}

interface ParsedLockup {
  id: string;
  title: string;
  thumbnailUrl: string;
  badgeText: string | null;
  metadataTexts: string[];
}

function parseLockupViewModel(lockup: Record<string, unknown>): ParsedLockup | null {
  const metadata = lockup.metadata as Record<string, unknown> | undefined;
  const lockupMetadata = metadata?.lockupMetadataViewModel as Record<string, unknown> | undefined;
  const title = getText(lockupMetadata?.title);
  if (!title) return null;

  const contentImage = lockup.contentImage as Record<string, unknown> | undefined;
  const thumbnailViewModel = contentImage?.thumbnailViewModel as Record<string, unknown> | undefined;
  const image = thumbnailViewModel?.image as { sources?: { url?: string }[] } | undefined;
  const thumbnailSources = image?.sources ?? [];
  const thumbnailUrl = thumbnailSources[thumbnailSources.length - 1]?.url ?? '';
  const videoId = videoIdFromThumbnailUrl(thumbnailUrl);
  if (!videoId) return null;

  const overlays = thumbnailViewModel?.overlays as unknown[] | undefined;
  let badgeText: string | null = null;
  if (Array.isArray(overlays)) {
    for (const overlay of overlays) {
      if (!overlay || typeof overlay !== 'object') continue;
      const bottomOverlay = (overlay as Record<string, unknown>).thumbnailBottomOverlayViewModel as
        | Record<string, unknown>
        | undefined;
      const badges = bottomOverlay?.badges as unknown[] | undefined;
      if (!Array.isArray(badges)) continue;
      for (const badge of badges) {
        if (!badge || typeof badge !== 'object') continue;
        const badgeViewModel = (badge as Record<string, unknown>).thumbnailBadgeViewModel as
          | Record<string, unknown>
          | undefined;
        const text = getText(badgeViewModel?.text);
        if (text) badgeText = text;
      }
    }
  }

  const metadataTexts: string[] = [];
  const contentMetadata = lockupMetadata?.metadata as Record<string, unknown> | undefined;
  const contentMetadataViewModel = contentMetadata?.contentMetadataViewModel as
    | Record<string, unknown>
    | undefined;
  const metadataRows = contentMetadataViewModel?.metadataRows as unknown[] | undefined;
  if (Array.isArray(metadataRows)) {
    for (const row of metadataRows) {
      if (!row || typeof row !== 'object') continue;
      const parts = (row as Record<string, unknown>).metadataParts as unknown[] | undefined;
      if (!Array.isArray(parts)) continue;
      for (const part of parts) {
        if (!part || typeof part !== 'object') continue;
        const text = getText((part as Record<string, unknown>).text);
        if (text) metadataTexts.push(text);
      }
    }
  }

  return {
    id: videoId,
    title,
    thumbnailUrl: thumbnailUrl || youtubeThumbnailUrl(videoId),
    badgeText,
    metadataTexts,
  };
}

function extractLockupsFromInitialData(data: unknown): ParsedLockup[] {
  const lockups: ParsedLockup[] = [];
  const seen = new Set<string>();

  walkObject(data, (record) => {
    if (!('lockupViewModel' in record)) return;
    const lockup = record.lockupViewModel;
    if (!lockup || typeof lockup !== 'object') return;
    const parsed = parseLockupViewModel(lockup as Record<string, unknown>);
    if (!parsed || seen.has(parsed.id)) return;
    seen.add(parsed.id);
    lockups.push(parsed);
  });

  return lockups;
}

function lockupToStream(lockup: ParsedLockup): YouTubeStream {
  const detailText = lockup.metadataTexts.find((text) => text !== lockup.title) ?? undefined;
  let status: YouTubeStreamStatus = 'completed';
  let scheduledStartTime: string | null = null;
  let publishedAt: string | null = null;

  if (lockup.badgeText === 'LIVE') {
    status = 'live';
  } else if (
    lockup.badgeText === 'Upcoming' ||
    lockup.badgeText === 'Scheduled' ||
    lockup.metadataTexts.some((text) => text.toLowerCase().startsWith('scheduled for'))
  ) {
    status = 'upcoming';
  } else if (lockup.badgeText && isDurationBadge(lockup.badgeText)) {
    status = 'completed';
    const streamedLine = lockup.metadataTexts.find((text) =>
      text.toLowerCase().startsWith('streamed live on'),
    );
    if (streamedLine) {
      const parsed = Date.parse(streamedLine.replace(/^streamed live on\s*/i, ''));
      if (!Number.isNaN(parsed)) {
        publishedAt = new Date(parsed).toISOString();
      }
    }
  }

  return {
    id: lockup.id,
    title: lockup.title,
    thumbnailUrl: lockup.thumbnailUrl,
    publishedAt,
    scheduledStartTime,
    status,
    url: youtubeWatchUrl(lockup.id),
    detailText,
  };
}

function parseLivePlayerResponse(html: string): YouTubeStream | null {
  const player = extractJsonAssignment(html, 'ytInitialPlayerResponse') as
    | Record<string, unknown>
    | null;
  if (!player) return null;

  const videoDetails = player.videoDetails as Record<string, unknown> | undefined;
  const playabilityStatus = player.playabilityStatus as Record<string, unknown> | undefined;
  const videoId = typeof videoDetails?.videoId === 'string' ? videoDetails.videoId : null;
  const title = getText(videoDetails?.title);
  if (!videoId || !title) return null;

  const thumbnails = (videoDetails?.thumbnail as { thumbnails?: { url?: string }[] } | undefined)
    ?.thumbnails;
  const thumbnailUrl =
    thumbnails?.[thumbnails.length - 1]?.url ?? youtubeThumbnailUrl(videoId);

  const status = typeof playabilityStatus?.status === 'string' ? playabilityStatus.status : '';
  const isLiveContent = Boolean(videoDetails?.isLiveContent);
  const liveStreamability = playabilityStatus?.liveStreamability as
    | Record<string, unknown>
    | undefined;
  const liveStreamabilityRenderer = liveStreamability?.liveStreamabilityRenderer as
    | Record<string, unknown>
    | undefined;
  const offlineSlate = liveStreamabilityRenderer?.offlineSlate as
    | Record<string, unknown>
    | undefined;
  const offlineSlateRenderer = offlineSlate?.liveStreamOfflineSlateRenderer as
    | Record<string, unknown>
    | undefined;
  const scheduledStartRaw = offlineSlateRenderer?.scheduledStartTime;
  const scheduledStartTime =
    typeof scheduledStartRaw === 'string' && scheduledStartRaw
      ? new Date(Number(scheduledStartRaw) * 1000).toISOString()
      : null;
  const subtitleText = getText(offlineSlateRenderer?.subtitleText);

  let streamStatus: YouTubeStreamStatus = 'completed';
  if (status === 'OK' && isLiveContent) {
    streamStatus = 'live';
  } else if (status === 'LIVE_STREAM_OFFLINE' || scheduledStartTime) {
    streamStatus = 'upcoming';
  }

  return {
    id: videoId,
    title,
    thumbnailUrl,
    publishedAt: null,
    scheduledStartTime,
    status: streamStatus,
    url: youtubeWatchUrl(videoId),
    detailText: subtitleText ?? undefined,
  };
}

function mergeStreams(
  streamLists: YouTubeStream[][],
): { live: YouTubeStream | null; upcoming: YouTubeStream[]; past: YouTubeStream[] } {
  const byId = new Map<string, YouTubeStream>();

  for (const list of streamLists) {
    for (const stream of list) {
      const existing = byId.get(stream.id);
      if (!existing) {
        byId.set(stream.id, stream);
        continue;
      }

      byId.set(stream.id, {
        ...existing,
        ...stream,
        title: stream.title || existing.title,
        thumbnailUrl: stream.thumbnailUrl || existing.thumbnailUrl,
        publishedAt: stream.publishedAt ?? existing.publishedAt,
        scheduledStartTime: stream.scheduledStartTime ?? existing.scheduledStartTime,
        detailText: stream.detailText ?? existing.detailText,
        status:
          stream.status === 'live' || existing.status === 'live'
            ? 'live'
            : stream.status === 'upcoming' || existing.status === 'upcoming'
              ? 'upcoming'
              : 'completed',
      });
    }
  }

  const all = [...byId.values()];
  const live = all.find((stream) => stream.status === 'live') ?? null;
  const upcoming = all
    .filter((stream) => stream.status === 'upcoming')
    .sort((a, b) => {
      const aTime = a.scheduledStartTime ? Date.parse(a.scheduledStartTime) : 0;
      const bTime = b.scheduledStartTime ? Date.parse(b.scheduledStartTime) : 0;
      return aTime - bTime;
    });
  const past = all
    .filter((stream) => stream.status === 'completed')
    .sort((a, b) => {
      const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return bTime - aTime;
    });

  return { live, upcoming, past };
}

async function scrapeYouTubeStreams(): Promise<YouTubeStreamsResult> {
  const [streamsHtml, liveHtml] = await Promise.all([
    fetchHtml(YOUTUBE_CHANNEL_STREAMS_URL),
    fetchHtml(YOUTUBE_CHANNEL_LIVE_URL),
  ]);

  const streamsData = extractJsonAssignment(streamsHtml, 'ytInitialData');
  const lockups = streamsData ? extractLockupsFromInitialData(streamsData) : [];
  const streamsFromTab = lockups.map(lockupToStream);
  const liveFromPlayer = parseLivePlayerResponse(liveHtml);

  const merged = mergeStreams([
    streamsFromTab,
    liveFromPlayer ? [liveFromPlayer] : [],
  ]);

  return {
    channelUrl: YOUTUBE_CHANNEL_URL,
    ...merged,
  };
}

export async function fetchYouTubeStreams(): Promise<YouTubeStreamsResult> {
  if (streamsCache && streamsCache.expiresAt > Date.now()) {
    return streamsCache.result;
  }

  const result = await scrapeYouTubeStreams();
  streamsCache = { result, expiresAt: Date.now() + CACHE_TTL_MS };
  return result;
}
