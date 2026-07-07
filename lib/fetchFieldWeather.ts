import { FIELD_TIMEZONE, getFieldCoordinates } from './fieldLocation';

export interface FieldWeather {
  temperatureF: number;
  feelsLikeF: number;
  humidity: number;
  windSpeedMph: number;
  windGustMph: number | null;
  windDirection: string;
  precipitationIn: number;
  rainfall24hIn: number;
  conditions: string;
  weatherCode: number;
  observedAt: string;
}

export class FieldWeatherError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'FieldWeatherError';
  }
}

const COMPASS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
] as const;

const WMO_LABELS: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with hail',
};

interface OpenMeteoCurrent {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m?: number;
  precipitation: number;
  weather_code: number;
}

interface OpenMeteoResponse {
  current?: OpenMeteoCurrent;
  hourly?: {
    precipitation: number[];
  };
}

function sumHourlyPrecipitation(values: number[] | undefined): number {
  if (!values?.length) return 0;
  return values.reduce((total, amount) => total + amount, 0);
}

export function degreesToCompass(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return COMPASS[index];
}

export function weatherCodeToLabel(code: number): string {
  return WMO_LABELS[code] ?? 'Unknown';
}

export async function fetchFieldWeather(): Promise<FieldWeather> {
  const { lat, lon } = getFieldCoordinates();

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'precipitation',
      'weather_code',
    ].join(','),
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    timezone: FIELD_TIMEZONE,
    hourly: 'precipitation',
    past_hours: '24',
    forecast_hours: '0',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new FieldWeatherError(`Weather service returned ${response.status}`);
    }

    const data = (await response.json()) as OpenMeteoResponse;

    if (!data.current) {
      throw new FieldWeatherError('Weather service returned no current conditions');
    }

    const current = data.current;

    return {
      temperatureF: Math.round(current.temperature_2m),
      feelsLikeF: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      windSpeedMph: Math.round(current.wind_speed_10m),
      windGustMph:
        current.wind_gusts_10m != null ? Math.round(current.wind_gusts_10m) : null,
      windDirection: degreesToCompass(current.wind_direction_10m),
      precipitationIn: current.precipitation,
      rainfall24hIn: sumHourlyPrecipitation(data.hourly?.precipitation),
      conditions: weatherCodeToLabel(current.weather_code),
      weatherCode: current.weather_code,
      observedAt: current.time,
    };
  } catch (error) {
    if (error instanceof FieldWeatherError) throw error;

    const message =
      error instanceof Error ? error.message : 'Unknown error while fetching weather';
    throw new FieldWeatherError(`Failed to load field weather: ${message}`, { cause: error });
  }
}
