import type { NextApiRequest, NextApiResponse } from 'next';
import { YouTubeStreamsError, fetchYouTubeStreams } from '@/lib/fetchYouTubeStreams';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const streams = await fetchYouTubeStreams();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({
      ...streams,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof YouTubeStreamsError
        ? error.message
        : 'Unable to load live streams from YouTube.';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(502).json({
      channelUrl: 'https://www.youtube.com/@BatonRougeRC',
      live: null,
      upcoming: [],
      past: [],
      fetchedAt: new Date().toISOString(),
      error: message,
    });
  }
}
