export const prerender = false;

import type { APIRoute } from 'astro';
import { FacebookMediaError, fetchGroupMedia } from '../../lib/fetchGroupMedia';

const MAX_LIMIT = 50;

function parseLimit(value: string | null): number | undefined {
  if (!value) return undefined;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return undefined;

  return Math.min(parsed, MAX_LIMIT);
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const limit = parseLimit(url.searchParams.get('limit'));
    const media = await fetchGroupMedia(limit ? { limit } : undefined);

    return new Response(
      JSON.stringify({
        media,
        fetchedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=21600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof FacebookMediaError
        ? error.message
        : 'Unable to load media from Facebook.';

    return new Response(
      JSON.stringify({
        media: [],
        fetchedAt: new Date().toISOString(),
        error: message,
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  }
};
