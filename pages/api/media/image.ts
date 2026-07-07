import type { NextApiRequest, NextApiResponse } from 'next';
import {
  FacebookMediaError,
  findMediaItem,
  upgradeImageResolution,
  type ClubMediaItem,
} from '@/lib/fetchGroupMedia';

const IMAGE_HEADERS = {
  Referer: 'https://www.facebook.com/',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
};

function isMediaType(value: string | string[] | undefined): value is ClubMediaItem['type'] {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'photo' || raw === 'video';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const type = req.query.type;

  if (!id || !isMediaType(type)) {
    return res.status(400).send('Bad request');
  }

  const size = Array.isArray(req.query.size) ? req.query.size[0] : req.query.size;

  try {
    const item = await findMediaItem(id, type);
    if (!item) {
      return res.status(404).send('Not found');
    }

    const sourceUrl =
      size === 'full' ? upgradeImageResolution(item.thumbnailUrl) : item.thumbnailUrl;
    const imageResponse = await fetch(sourceUrl, { headers: IMAGE_HEADERS });
    if (!imageResponse.ok) {
      return res.status(502).send('Unable to load image');
    }

    const contentType = imageResponse.headers.get('Content-Type') ?? 'image/jpeg';
    const buffer = Buffer.from(await imageResponse.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=21600, stale-while-revalidate=86400');
    return res.status(200).send(buffer);
  } catch (error) {
    const message =
      error instanceof FacebookMediaError
        ? error.message
        : 'Unable to load media thumbnail.';

    return res.status(502).send(message);
  }
}
