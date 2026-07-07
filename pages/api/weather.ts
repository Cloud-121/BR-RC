import type { NextApiRequest, NextApiResponse } from 'next';
import { FieldWeatherError, fetchFieldWeather } from '@/lib/fetchFieldWeather';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const weather = await fetchFieldWeather();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json({
      weather,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof FieldWeatherError
        ? error.message
        : 'Unable to load field weather.';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(502).json({
      weather: null,
      fetchedAt: new Date().toISOString(),
      error: message,
    });
  }
}
