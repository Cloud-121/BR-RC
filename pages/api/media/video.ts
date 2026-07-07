import type { NextApiRequest, NextApiResponse } from 'next';
import { FacebookMediaError, findMediaItem } from '@/lib/fetchGroupMedia';
import { FACEBOOK_HEADERS, resolveVideoSourceUrl } from '@/lib/fetchVideoSource';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!id) {
    return res.status(400).send('Bad request');
  }

  try {
    const item = await findMediaItem(id, 'video');
    if (!item) {
      return res.status(404).send('Not found');
    }

    const sourceUrl = await resolveVideoSourceUrl(item.id, item.postUrl);
    const videoResponse = await fetch(sourceUrl, { headers: FACEBOOK_HEADERS });

    if (!videoResponse.ok) {
      return res.status(502).send('Unable to load video');
    }

    const contentType = videoResponse.headers.get('Content-Type') ?? 'video/mp4';
    const buffer = Buffer.from(await videoResponse.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.setHeader('Accept-Ranges', 'bytes');
    return res.status(200).send(buffer);
  } catch (error) {
    const message =
      error instanceof FacebookMediaError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Unable to load video.';

    return res.status(502).send(message);
  }
}
