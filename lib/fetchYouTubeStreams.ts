import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { YOUTUBE_CHANNEL_URL, youtubeThumbnailUrl, youtubeWatchUrl } from './youtubeChannel';

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

interface YoutubeStreamsFileEntry {
  id: string;
  title: string;
  /** ISO-8601 date/time used for upcoming vs past and sorting */
  date: string;
  /** Optional override. Omit to classify from `date` vs now. */
  status?: YouTubeStreamStatus;
  thumbnailUrl?: string;
}

interface YoutubeStreamsFile {
  channelUrl?: string;
  streams: YoutubeStreamsFileEntry[];
}

const STREAMS_FILE = path.join(process.cwd(), 'data', 'youtube-streams.json');

function dateMs(iso: string): number {
  const parsed = Date.parse(iso);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function classifyStatus(entry: YoutubeStreamsFileEntry, now: number): YouTubeStreamStatus {
  if (entry.status === 'live' || entry.status === 'upcoming' || entry.status === 'completed') {
    return entry.status;
  }

  return dateMs(entry.date) > now ? 'upcoming' : 'completed';
}

function toStream(entry: YoutubeStreamsFileEntry, status: YouTubeStreamStatus): YouTubeStream {
  const id = entry.id.trim();
  const when = entry.date;

  return {
    id,
    title: entry.title.trim(),
    thumbnailUrl: entry.thumbnailUrl?.trim() || youtubeThumbnailUrl(id),
    publishedAt: status === 'completed' ? when : null,
    scheduledStartTime: status === 'upcoming' || status === 'live' ? when : null,
    status,
    url: youtubeWatchUrl(id),
  };
}

function sortAndBucket(entries: YoutubeStreamsFileEntry[]): {
  live: YouTubeStream | null;
  upcoming: YouTubeStream[];
  past: YouTubeStream[];
} {
  const now = Date.now();
  const liveCandidates: YouTubeStream[] = [];
  const upcoming: YouTubeStream[] = [];
  const past: YouTubeStream[] = [];

  for (const entry of entries) {
    if (!entry?.id?.trim() || entry.id.includes('REPLACE_WITH')) continue;
    if (!entry.title?.trim() || !entry.date) continue;

    const status = classifyStatus(entry, now);
    const stream = toStream(entry, status);

    if (status === 'live') liveCandidates.push(stream);
    else if (status === 'upcoming') upcoming.push(stream);
    else past.push(stream);
  }

  upcoming.sort((a, b) => dateMs(a.scheduledStartTime ?? '') - dateMs(b.scheduledStartTime ?? ''));
  past.sort((a, b) => dateMs(b.publishedAt ?? '') - dateMs(a.publishedAt ?? ''));

  return {
    live: liveCandidates[0] ?? null,
    upcoming,
    past,
  };
}

export async function fetchYouTubeStreams(): Promise<YouTubeStreamsResult> {
  let raw: string;
  try {
    raw = await readFile(STREAMS_FILE, 'utf8');
  } catch (error) {
    throw new YouTubeStreamsError('Could not read data/youtube-streams.json', { cause: error });
  }

  let parsed: YoutubeStreamsFile;
  try {
    parsed = JSON.parse(raw) as YoutubeStreamsFile;
  } catch (error) {
    throw new YouTubeStreamsError('data/youtube-streams.json is not valid JSON', { cause: error });
  }

  if (!parsed || !Array.isArray(parsed.streams)) {
    throw new YouTubeStreamsError('data/youtube-streams.json must include a streams array');
  }

  return {
    channelUrl: parsed.channelUrl?.trim() || YOUTUBE_CHANNEL_URL,
    ...sortAndBucket(parsed.streams),
  };
}
