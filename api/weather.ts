import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FieldWeatherError, fetchFieldWeather } from '../src/lib/fetchFieldWeather.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const weather = await fetchFieldWeather();

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      weather,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof FieldWeatherError
        ? error.message
        : 'Unable to load field weather.';

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(502).json({
      weather: null,
      fetchedAt: new Date().toISOString(),
      error: message,
    });
  }
}
