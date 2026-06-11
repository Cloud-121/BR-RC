import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FacebookEventsError, fetchGroupEvents } from '../src/lib/fetchGroupEvents.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const events = await fetchGroupEvents();

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      events,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof FacebookEventsError
        ? error.message
        : 'Unable to load events from Facebook.';

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(502).json({
      events: [],
      fetchedAt: new Date().toISOString(),
      error: message,
    });
  }
}
