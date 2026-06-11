export const prerender = false;

import type { APIRoute } from 'astro';
import { FieldWeatherError, fetchFieldWeather } from '../../lib/fetchFieldWeather';

export const GET: APIRoute = async () => {
  try {
    const weather = await fetchFieldWeather();

    return new Response(
      JSON.stringify({
        weather,
        fetchedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=900, stale-while-revalidate=3600',
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof FieldWeatherError
        ? error.message
        : 'Unable to load field weather.';

    return new Response(
      JSON.stringify({
        weather: null,
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
