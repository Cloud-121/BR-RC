import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FacebookMediaError, fetchGroupMedia } from '../src/lib/fetchGroupMedia.js';

const MAX_LIMIT = 50;

function parseLimit(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return undefined;

  return Math.min(parsed, MAX_LIMIT);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const limit = parseLimit(req.query.limit);
    const media = await fetchGroupMedia(limit ? { limit } : undefined);

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      media,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof FacebookMediaError
        ? error.message
        : 'Unable to load media from Facebook.';

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(502).json({
      media: [],
      fetchedAt: new Date().toISOString(),
      error: message,
    });
  }
}
