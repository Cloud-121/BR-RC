export const prerender = false;

import type { APIRoute } from 'astro';
import { FacebookEventsError, fetchGroupEvents } from '../../lib/fetchGroupEvents';

export const GET: APIRoute = async () => {
  try {
    const events = await fetchGroupEvents();

    return new Response(
      JSON.stringify({
        events,
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
      error instanceof FacebookEventsError
        ? error.message
        : 'Unable to load events from Facebook.';

    return new Response(
      JSON.stringify({
        events: [],
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
