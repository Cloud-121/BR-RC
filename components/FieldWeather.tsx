import Link from 'next/link';
import type { FieldWeather } from '@/lib/fetchFieldWeather';
import { assessFlyability } from '@/lib/flyability';
import { FIELD_NAME, FIELD_TIMEZONE } from '@/lib/fieldLocation';
import FlyabilityBadge from './FlyabilityBadge';
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
    <aside className="mb-6 rounded-[var(--radius-default)] border border-border bg-white p-6 shadow-[var(--shadow-card)] border-l-4 border-l-sky">
      <h2 className="mb-4 text-xl">Current Conditions at {FIELD_NAME}</h2>
      {error ? (
        <p>{error}</p>
      ) : weather ? (
        <>
          {flyability && <FlyabilityBadge flyability={flyability} />}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              ['Temperature', `${weather.temperatureF}°F`],
              ['Feels like', `${weather.feelsLikeF}°F`],
              ['Wind', `${weather.windSpeedMph} mph ${weather.windDirection}`],
              ['Gusts', weather.windGustMph != null ? `${weather.windGustMph} mph` : '—'],
              ['Humidity', `${weather.humidity}%`],
              ['Current hour', formatPrecip(weather.precipitationIn)],
              ['Rainfall (24 hr)', formatPrecip(weather.rainfall24hIn)],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {label}
                </span>
                <span className="text-[1.05rem] font-semibold text-green">{value}</span>
              </div>
            ))}
            <div className="col-span-2 flex flex-col gap-0.5 sm:col-span-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Conditions
              </span>
              <span className="text-[1.05rem] font-semibold text-green">{weather.conditions}</span>
            </div>
          </div>
          <p className="mb-0 mt-4 text-sm text-text-muted">
            Last updated {formatObservedAt(weather.observedAt)} (Central Time)
          </p>
        </>
      ) : null}
    </aside>
  );
}
