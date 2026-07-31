import Link from 'next/link';
import type { FieldWeather } from '@/lib/fetchFieldWeather';
import { assessFlyability, assessFlyabilityDetailed, getMetricStatus } from '@/lib/flyability';
import { FIELD_NAME, FIELD_TIMEZONE } from '@/lib/fieldLocation';
import FlyabilityBadge from './FlyabilityBadge';
import HourlyForecast from './weather/HourlyForecast';
import WeatherMetricTile from './weather/WeatherMetricTile';
import WindCompass from './weather/WindCompass';
import { cn } from '@/lib/cn';

interface FieldWeatherProps {
  weather: FieldWeather | null;
  error?: string | null;
  compact?: boolean;
}

function formatObservedAt(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: FIELD_TIMEZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatPrecip(inches: number): string {
  if (inches <= 0) return 'None';
  if (inches < 0.01) return 'Trace';
  return `${inches.toFixed(2)} in`;
}

export default function FieldWeatherPanel({
  weather,
  error = null,
  compact = false,
}: FieldWeatherProps) {
  const flyability = weather ? assessFlyability(weather) : null;
  const flyabilityDetail = weather ? assessFlyabilityDetailed(weather) : null;

  if (compact) {
    return (
      <aside className="mb-6 rounded-[var(--radius-default)] border border-border bg-white p-4 shadow-[var(--shadow-card)] border-l-4 border-l-sky">
        {error ? (
          <p>
            Field weather unavailable. <Link href="/kissner-field">View Kissner Field</Link>
          </p>
        ) : weather ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[0.95rem]">
                <strong>{FIELD_NAME}</strong>
              </p>
              <p className="mb-1 text-[0.95rem]">
                {weather.temperatureF}°F · Wind {weather.windSpeedMph} mph {weather.windDirection}
                {weather.windGustMph != null && ` · Gusts ${weather.windGustMph} mph`}
              </p>
              <p className="mb-1 text-[0.95rem]">
                {weather.conditions} · Rain 24h: {formatPrecip(weather.rainfall24hIn)}
              </p>
              <p className="m-0 text-sm">
                <Link href="/kissner-field">Full conditions</Link>
              </p>
            </div>
            {flyability && <FlyabilityBadge flyability={flyability} compact />}
          </div>
        ) : null}
      </aside>
    );
  }

  return (
    <aside className="mx-auto mb-6 mt-6 max-w-content rounded-[var(--radius-default)] border border-border bg-white p-6 shadow-[var(--shadow-card)] border-l-4 border-l-sky max-md:mx-4 max-md:p-5">
      <h2 className="mb-4 text-xl">Field Conditions at {FIELD_NAME}</h2>
      {error ? (
        <p>{error}</p>
      ) : weather && flyabilityDetail ? (
        <>
          <div
            className={cn(
              'mb-6 rounded-[var(--radius-default)] px-5 py-4',
              flyabilityDetail.status === 'good'
                ? 'bg-green-pale text-green-light'
                : 'bg-[#f8ebe3] text-rust',
            )}
          >
            <p className="mb-1 text-lg font-bold">
              {flyabilityDetail.status === 'good' ? 'Good to fly' : 'Not so great to fly'}
            </p>
            {flyabilityDetail.reasons.length > 0 ? (
              <ul className="m-0 list-disc pl-5 text-sm">
                {flyabilityDetail.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p className="m-0 text-sm">Conditions look favorable for flying right now.</p>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[7rem_1fr] lg:items-center">
            <WindCompass
              directionDeg={weather.windDirectionDeg}
              directionLabel={weather.windDirection}
              className="justify-self-center"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <WeatherMetricTile
                label="Wind"
                value={`${weather.windSpeedMph} mph`}
                status={getMetricStatus('wind', weather)}
              />
              <WeatherMetricTile
                label="Gusts"
                value={weather.windGustMph != null ? `${weather.windGustMph} mph` : '—'}
                status={getMetricStatus('gusts', weather)}
              />
              <WeatherMetricTile
                label="Temperature"
                value={`${weather.temperatureF}°F`}
              />
              <WeatherMetricTile
                label="Conditions"
                value={weather.conditions}
                status={getMetricStatus('conditions', weather)}
              />
              <WeatherMetricTile
                label="Precipitation"
                value={formatPrecip(weather.precipitationIn)}
                status={getMetricStatus('precip', weather)}
              />
              <WeatherMetricTile
                label="Rainfall (24 hr)"
                value={formatPrecip(weather.rainfall24hIn)}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <WeatherMetricTile label="Feels like" value={`${weather.feelsLikeF}°F`} />
            <WeatherMetricTile label="Humidity" value={`${weather.humidity}%`} />
          </div>

          <HourlyForecast hourly={weather.hourly} />

          <p className="mb-0 mt-4 text-sm text-text-muted">
            Last updated {formatObservedAt(weather.observedAt)} (Central Time). Field conditions can
            differ from this reading.
          </p>
        </>
      ) : null}
    </aside>
  );
}
