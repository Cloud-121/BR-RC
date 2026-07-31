import type { FieldWeather, HourlyWeatherSlot } from './fetchFieldWeather';

export type Flyability = 'good' | 'not-great';
export type MetricType = 'wind' | 'gusts' | 'precip' | 'conditions';
export type MetricStatus = 'ok' | 'warning';

export const MAX_WIND_MPH = 15;
export const MAX_GUST_MPH = 20;

export interface FlyabilityInput {
  windSpeedMph: number;
  windGustMph: number | null;
  precipitationIn: number;
  weatherCode: number;
}

export interface FlyabilityAssessment {
  status: Flyability;
  reasons: string[];
}

export function isAdverseWeatherCode(code: number): boolean {
  if (code === 45 || code === 48) return true;
  if (code >= 51 && code <= 67) return true;
  if (code >= 71 && code <= 77) return true;
  if (code >= 80 && code <= 86) return true;
  if (code >= 95 && code <= 99) return true;
  return false;
}

function collectFlyabilityReasons(input: FlyabilityInput): string[] {
  const reasons: string[] = [];

  if (input.windSpeedMph > MAX_WIND_MPH) {
    reasons.push(`Wind above ${MAX_WIND_MPH} mph`);
  }
  if (input.windGustMph != null && input.windGustMph > MAX_GUST_MPH) {
    reasons.push(`Gusts above ${MAX_GUST_MPH} mph`);
  }
  if (input.precipitationIn > 0) {
    reasons.push('Active precipitation');
  }
  if (isAdverseWeatherCode(input.weatherCode)) {
    reasons.push('Adverse weather conditions');
  }

  return reasons;
}

export function assessFlyabilityInput(input: FlyabilityInput): Flyability {
  return collectFlyabilityReasons(input).length > 0 ? 'not-great' : 'good';
}

export function assessFlyability(weather: FieldWeather): Flyability {
  return assessFlyabilityInput(weather);
}

export function assessFlyabilityDetailed(weather: FieldWeather): FlyabilityAssessment {
  const reasons = collectFlyabilityReasons(weather);
  return {
    status: reasons.length > 0 ? 'not-great' : 'good',
    reasons,
  };
}

export function getMetricStatus(metric: MetricType, weather: FieldWeather): MetricStatus {
  switch (metric) {
    case 'wind':
      return weather.windSpeedMph > MAX_WIND_MPH ? 'warning' : 'ok';
    case 'gusts':
      return weather.windGustMph != null && weather.windGustMph > MAX_GUST_MPH
        ? 'warning'
        : 'ok';
    case 'precip':
      return weather.precipitationIn > 0 ? 'warning' : 'ok';
    case 'conditions':
      return isAdverseWeatherCode(weather.weatherCode) ? 'warning' : 'ok';
    default:
      return 'ok';
  }
}

export function assessHourlyFlyability(slot: HourlyWeatherSlot): Flyability {
  return assessFlyabilityInput(slot);
}
