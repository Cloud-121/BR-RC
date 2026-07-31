export const YOUTUBE_CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE ?? 'BatonRougeRC';

export const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/@${YOUTUBE_CHANNEL_HANDLE}`;
export const YOUTUBE_CHANNEL_LIVE_URL = `${YOUTUBE_CHANNEL_URL}/live`;
export const YOUTUBE_CHANNEL_STREAMS_URL = `${YOUTUBE_CHANNEL_URL}/streams`;

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
