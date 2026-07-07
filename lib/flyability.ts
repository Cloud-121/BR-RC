import type { FieldWeather } from './fetchFieldWeather';

export type Flyability = 'good' | 'not-great';

const MAX_WIND_MPH = 15;
const MAX_GUST_MPH = 20;

function isAdverseWeatherCode(code: number): boolean {
  if (code === 45 || code === 48) return true;
  if (code >= 51 && code <= 67) return true;
  if (code >= 71 && code <= 77) return true;
  if (code >= 80 && code <= 86) return true;
  if (code >= 95 && code <= 99) return true;
  return false;
}

export function assessFlyability(weather: FieldWeather): Flyability {
  if (weather.windSpeedMph > MAX_WIND_MPH) return 'not-great';
  if (weather.windGustMph != null && weather.windGustMph > MAX_GUST_MPH) return 'not-great';
  if (weather.precipitationIn > 0) return 'not-great';
  if (isAdverseWeatherCode(weather.weatherCode)) return 'not-great';
  return 'good';
}
