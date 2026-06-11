export const prerender = false;

import type { APIRoute } from 'astro';
import { FacebookMediaError, findMediaItem, type ClubMediaItem } from '../../../lib/fetchGroupMedia';

const IMAGE_HEADERS = {
  Referer: 'https://www.facebook.com/',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
};

function isMediaType(value: string | null): value is ClubMediaItem['type'] {
  return value === 'photo' || value === 'video';
}

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type');

  if (!id || !isMediaType(type)) {
    return new Response('Bad request', { status: 400 });
  }

  try {
    const item = await findMediaItem(id, type);
    if (!item) {
      return new Response('Not found', { status: 404 });
    }

    const imageResponse = await fetch(item.thumbnailUrl, { headers: IMAGE_HEADERS });
    if (!imageResponse.ok) {
      return new Response('Unable to load image', { status: 502 });
    }

    return new Response(imageResponse.body, {
      status: 200,
      headers: {
        'Content-Type': imageResponse.headers.get('Content-Type') ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=21600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const message =
      error instanceof FacebookMediaError
        ? error.message
        : 'Unable to load media thumbnail.';

    return new Response(message, { status: 502 });
  }
};
