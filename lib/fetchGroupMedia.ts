import axios from 'axios';
import { findJsonInString } from './findJsonInString';

export interface ClubMediaItem {
  id: string;
  type: 'photo' | 'video';
  thumbnailUrl: string;
  postUrl: string;
  caption?: string;
  createdAt?: string;
}

export class FacebookMediaError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'FacebookMediaError';
  }
}

export interface FetchGroupMediaOptions {
  limit?: number;
}

const DEFAULT_GROUP_MEDIA_URL = 'https://www.facebook.com/groups/BRRCC/media';
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

let mediaCache: { items: ClubMediaItem[]; expiresAt: number } | null = null;

const FETCH_HEADERS = {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.6',
  'cache-control': 'max-age=0',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'sec-gpc': '1',
  'upgrade-insecure-requests': '1',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
};

interface MediaNode {
  id?: string;
  url?: string;
  accessibility_caption?: string;
  image?: { uri?: string };
}

interface MediaEdge {
  node?: MediaNode;
}

interface MediaFeed {
  edges?: MediaEdge[];
}

function getGroupMediaBaseUrl(): string {
  return (process.env.FACEBOOK_GROUP_MEDIA_URL ?? DEFAULT_GROUP_MEDIA_URL).replace(/\/$/, '');
}

function getGroupSlug(baseUrl: string): string {
  const match = baseUrl.match(/\/groups\/([^/]+)/);
  return match?.[1] ?? 'BRRCC';
}

function getAxiosProxyOptions():
  | { proxy: { host: string; port: number; protocol: string; auth?: { username: string; password: string } } }
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
    throw new Error(`HTTP ${response.status} fetching ${url}`);
  }

  return response.text();
}

function decodeUri(uri: string): string {
  return uri.replace(/&amp;/g, '&');
}

function parseMediaFromHtml(html: string, type: 'photo' | 'video', groupSlug: string): ClubMediaItem[] {
  const { jsonData } = findJsonInString(html, 'media', (data) => {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return false;
    const feed = data as MediaFeed;
    return Array.isArray(feed.edges) && feed.edges.length > 0;
  });

  if (!jsonData || Array.isArray(jsonData)) {
    return [];
  }

  const feed = jsonData as MediaFeed;
  if (!feed.edges) {
    return [];
  }

  const items: ClubMediaItem[] = [];

  for (const edge of feed.edges) {
    const node = edge.node;
    if (!node?.id) continue;

    const thumbnailUrl = decodeUri(node.image?.uri ?? '');
    if (!thumbnailUrl) continue;

    const postUrl =
      type === 'video'
        ? (node.url ?? `https://www.facebook.com/groups/${groupSlug}/media/videos`)
        : `https://www.facebook.com/photo/?fbid=${node.id}`;

    items.push({
      id: node.id,
      type,
      thumbnailUrl,
      postUrl,
      caption: node.accessibility_caption,
    });
  }

  return items;
}

function interleaveMedia(photos: ClubMediaItem[], videos: ClubMediaItem[]): ClubMediaItem[] {
  const combined: ClubMediaItem[] = [];
  const maxLength = Math.max(photos.length, videos.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < photos.length) combined.push(photos[i]);
    if (i < videos.length) combined.push(videos[i]);
  }

  return combined;
}

async function scrapeGroupMedia(): Promise<ClubMediaItem[]> {
  const baseUrl = getGroupMediaBaseUrl();
  const groupSlug = getGroupSlug(baseUrl);

  const [photosHtml, videosHtml] = await Promise.all([
    fetchHtml(`${baseUrl}/photos`),
    fetchHtml(`${baseUrl}/videos`),
  ]);

  const photos = parseMediaFromHtml(photosHtml, 'photo', groupSlug);
  const videos = parseMediaFromHtml(videosHtml, 'video', groupSlug);

  if (photos.length === 0 && videos.length === 0) {
    throw new Error('No media found in the Facebook group page');
  }

  const seen = new Set<string>();
  return interleaveMedia(photos, videos).filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

async function getCachedMediaItems(): Promise<ClubMediaItem[]> {
  const now = Date.now();
  if (mediaCache && mediaCache.expiresAt > now) {
    return mediaCache.items;
  }

  const items = await scrapeGroupMedia();
  mediaCache = { items, expiresAt: now + CACHE_TTL_MS };
  return items;
}

export function getMediaThumbnailUrl(id: string, type: ClubMediaItem['type']): string {
  const params = new URLSearchParams({ id, type });
  return `/api/media/image?${params.toString()}`;
}

export async function fetchGroupMedia(options: FetchGroupMediaOptions = {}): Promise<ClubMediaItem[]> {
  const limit = Math.min(Math.max(options.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);

  try {
    return (await getCachedMediaItems()).slice(0, limit);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error while fetching Facebook media';
    throw new FacebookMediaError(`Failed to load media from Facebook: ${message}`, {
      cause: error,
    });
  }
}

export async function findMediaItem(
  id: string,
  type: ClubMediaItem['type'],
): Promise<ClubMediaItem | undefined> {
  const items = await getCachedMediaItems();
  return items.find((item) => item.id === id && item.type === type);
}
