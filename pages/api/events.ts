import type { NextApiRequest, NextApiResponse } from 'next';
import { FacebookEventsError, fetchGroupEvents } from '@/lib/fetchGroupEvents';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const events = await fetchGroupEvents();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({
      events,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof FacebookEventsError
        ? error.message
        : 'Unable to load events from Facebook.';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(502).json({
      events: [],
      fetchedAt: new Date().toISOString(),
      error: message,
    });
  }
}
