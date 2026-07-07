import axios from 'axios';

const FETCH_HEADERS = {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.6',
  'cache-control': 'max-age=0',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
};

const FACEBOOK_HEADERS = {
  Referer: 'https://www.facebook.com/',
  'User-Agent': FETCH_HEADERS['user-agent'],
};

const SOURCE_CACHE_TTL_MS = 60 * 60 * 1000;

const videoSourceCache = new Map<string, { url: string; expiresAt: number }>();

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

async function fetchFacebookHtml(url: string): Promise<string> {
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

function decodeFacebookUrl(url: string): string {
  return url
    .replace(/\\u0025/g, '%')
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&');
}

export function extractVideoSourceUrl(html: string): string | null {
  const patterns = [
    /"browser_native_hd_url":"([^"]+)"/,
    /"browser_native_sd_url":"([^"]+)"/,
    /"playable_url":"([^"]+)"/,
    /"hd_src":"([^"]+)"/,
    /"sd_src":"([^"]+)"/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeFacebookUrl(match[1]);
    }
  }

  return null;
}

export async function resolveVideoSourceUrl(
  videoId: string,
  postUrl: string,
): Promise<string> {
  const cached = videoSourceCache.get(videoId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  const candidates = [
    postUrl,
    `https://www.facebook.com/watch/?v=${videoId}`,
    `https://www.facebook.com/video.php?v=${videoId}`,
  ];

  for (const url of candidates) {
    try {
      const html = await fetchFacebookHtml(url);
      const sourceUrl = extractVideoSourceUrl(html);
      if (sourceUrl) {
        videoSourceCache.set(videoId, {
          url: sourceUrl,
          expiresAt: Date.now() + SOURCE_CACHE_TTL_MS,
        });
        return sourceUrl;
      }
    } catch {
      continue;
    }
  }

  throw new Error('Could not find a playable video source on Facebook');
}

export function getMediaVideoUrl(id: string): string {
  const params = new URLSearchParams({ id, type: 'video' });
  return `/api/media/video?${params.toString()}`;
}

export { FACEBOOK_HEADERS };
