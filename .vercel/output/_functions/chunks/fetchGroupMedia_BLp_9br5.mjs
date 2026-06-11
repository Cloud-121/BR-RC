import axios from 'axios';

function findJsonInString(dataString, key, isDesiredValue) {
  const prefix = `"${key}":`;
  let startPosition = 0;
  while (true) {
    let idx = dataString.indexOf(prefix, startPosition);
    if (idx === -1) {
      return { startIndex: -1, endIndex: -1, jsonData: null };
    }
    idx += prefix.length;
    const startIndex = idx;
    const startCharacter = dataString[startIndex];
    if (startCharacter === "n" && dataString.slice(startIndex, startIndex + 4) === "null") {
      return { startIndex, endIndex: startIndex + 3, jsonData: null };
    }
    if (startCharacter !== "{" && startCharacter !== "[") {
      throw new Error(`Invalid start character: ${startCharacter}`);
    }
    const endCharacter = startCharacter === "{" ? "}" : "]";
    let nestedLevel = 0;
    let isIndexInString = false;
    while (idx < dataString.length - 1) {
      idx++;
      if (dataString[idx] === '"' && dataString[idx - 1] !== "\\") {
        isIndexInString = !isIndexInString;
      } else if (dataString[idx] === endCharacter && !isIndexInString) {
        if (nestedLevel === 0) {
          break;
        }
        nestedLevel--;
      } else if (dataString[idx] === startCharacter && !isIndexInString) {
        nestedLevel++;
      }
    }
    const jsonDataString = dataString.slice(startIndex, idx + 1);
    const jsonData = JSON.parse(jsonDataString);
    if (!isDesiredValue || isDesiredValue(jsonData)) {
      return { startIndex, endIndex: idx, jsonData };
    }
    startPosition = idx;
  }
}

class FacebookMediaError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "FacebookMediaError";
  }
}
const DEFAULT_GROUP_MEDIA_URL = "https://www.facebook.com/groups/BRRCC/media";
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;
const CACHE_TTL_MS = 6 * 60 * 60 * 1e3;
let mediaCache = null;
const FETCH_HEADERS = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.6",
  "cache-control": "max-age=0",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "sec-gpc": "1",
  "upgrade-insecure-requests": "1",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
};
function getGroupMediaBaseUrl() {
  return (process.env.FACEBOOK_GROUP_MEDIA_URL ?? DEFAULT_GROUP_MEDIA_URL).replace(/\/$/, "");
}
function getGroupSlug(baseUrl) {
  const match = baseUrl.match(/\/groups\/([^/]+)/);
  return match?.[1] ?? "BRRCC";
}
function getAxiosProxyOptions() {
  const proxyUrl = process.env.HTTP_PROXY;
  if (!proxyUrl) return void 0;
  try {
    const parsed = new URL(proxyUrl);
    return {
      proxy: {
        host: parsed.hostname,
        port: Number(parsed.port) || (parsed.protocol === "https:" ? 443 : 80),
        protocol: parsed.protocol.replace(":", ""),
        auth: parsed.username && parsed.password ? { username: parsed.username, password: parsed.password } : void 0
      }
    };
  } catch {
    return void 0;
  }
}
async function fetchHtml(url) {
  const proxyOptions = getAxiosProxyOptions();
  if (proxyOptions) {
    const response2 = await axios.get(url, {
      headers: FETCH_HEADERS,
      ...proxyOptions
    });
    return response2.data;
  }
  const response = await fetch(url, { headers: FETCH_HEADERS, redirect: "follow" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${url}`);
  }
  return response.text();
}
function decodeUri(uri) {
  return uri.replace(/&amp;/g, "&");
}
function parseMediaFromHtml(html, type, groupSlug) {
  const { jsonData } = findJsonInString(
    html,
    "media",
    (data) => typeof data === "object" && data !== null && !Array.isArray(data) && Array.isArray(data.edges) && data.edges.length > 0
  );
  if (!jsonData || Array.isArray(jsonData) || !jsonData.edges) {
    return [];
  }
  const items = [];
  for (const edge of jsonData.edges) {
    const node = edge.node;
    if (!node?.id) continue;
    const thumbnailUrl = decodeUri(node.image?.uri ?? "");
    if (!thumbnailUrl) continue;
    const postUrl = type === "video" ? node.url ?? `https://www.facebook.com/groups/${groupSlug}/media/videos` : `https://www.facebook.com/photo/?fbid=${node.id}`;
    items.push({
      id: node.id,
      type,
      thumbnailUrl,
      postUrl,
      caption: node.accessibility_caption
    });
  }
  return items;
}
function interleaveMedia(photos, videos) {
  const combined = [];
  const maxLength = Math.max(photos.length, videos.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < photos.length) combined.push(photos[i]);
    if (i < videos.length) combined.push(videos[i]);
  }
  return combined;
}
async function scrapeGroupMedia() {
  const baseUrl = getGroupMediaBaseUrl();
  const groupSlug = getGroupSlug(baseUrl);
  const [photosHtml, videosHtml] = await Promise.all([
    fetchHtml(`${baseUrl}/photos`),
    fetchHtml(`${baseUrl}/videos`)
  ]);
  const photos = parseMediaFromHtml(photosHtml, "photo", groupSlug);
  const videos = parseMediaFromHtml(videosHtml, "video", groupSlug);
  if (photos.length === 0 && videos.length === 0) {
    throw new Error("No media found in the Facebook group page");
  }
  const seen = /* @__PURE__ */ new Set();
  return interleaveMedia(photos, videos).filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
async function getCachedMediaItems() {
  const now = Date.now();
  if (mediaCache && mediaCache.expiresAt > now) {
    return mediaCache.items;
  }
  const items = await scrapeGroupMedia();
  mediaCache = { items, expiresAt: now + CACHE_TTL_MS };
  return items;
}
function getMediaThumbnailUrl(id, type) {
  const params = new URLSearchParams({ id, type });
  return `/api/media/image?${params.toString()}`;
}
async function fetchGroupMedia(options = {}) {
  const limit = Math.min(Math.max(options.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
  try {
    return (await getCachedMediaItems()).slice(0, limit);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error while fetching Facebook media";
    throw new FacebookMediaError(`Failed to load media from Facebook: ${message}`, {
      cause: error
    });
  }
}
async function findMediaItem(id, type) {
  const items = await getCachedMediaItems();
  return items.find((item) => item.id === id && item.type === type);
}

export { FacebookMediaError as F, fetchGroupMedia as a, findMediaItem as f, getMediaThumbnailUrl as g };
