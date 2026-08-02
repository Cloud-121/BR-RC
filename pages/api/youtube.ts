import type { NextApiRequest, NextApiResponse } from 'next';
import { YouTubeStreamsError, fetchYouTubeStreams } from '@/lib/fetchYouTubeStreams';
import { YOUTUBE_CHANNEL_URL } from '@/lib/youtubeChannel';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const streams = await fetchYouTubeStreams();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json({
      ...streams,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof YouTubeStreamsError
        ? error.message
        : 'Unable to load meeting streams.';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(500).json({
      channelUrl: YOUTUBE_CHANNEL_URL,
      live: null,
      upcoming: [],
      past: [],
      fetchedAt: new Date().toISOString(),
      error: message,
    });
  }
}
