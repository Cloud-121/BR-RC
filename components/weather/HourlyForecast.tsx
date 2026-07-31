import type { HourlyWeatherSlot } from '@/lib/fetchFieldWeather';
import { assessHourlyFlyability } from '@/lib/flyability';
import { FIELD_TIMEZONE } from '@/lib/fieldLocation';
import { cn } from '@/lib/cn';

interface HourlyForecastProps {
  hourly: HourlyWeatherSlot[];
}

function formatHour(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone: FIELD_TIMEZONE,
    hour: 'numeric',
  });
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  if (!hourly.length) return null;

  return (
    <section className="mt-6">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
        24-Hour Outlook
      </h3>
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex min-w-max gap-2">
          {hourly.map((slot) => {
            const flyability = assessHourlyFlyability(slot);
            const isGood = flyability === 'good';

            return (
              <div
                key={slot.time}
                className="flex w-[5.5rem] shrink-0 flex-col items-center gap-1.5 rounded-[var(--radius-default)] border border-border bg-cream px-2 py-3 text-center"
              >
                <span className="text-xs font-semibold text-text-muted">{formatHour(slot.time)}</span>
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    isGood ? 'bg-green-light' : 'bg-rust',
                  )}
                  aria-label={isGood ? 'Good to fly' : 'Not good to fly'}
                />
                <span className="text-xs font-medium leading-tight text-text">{slot.conditions}</span>
                <span className="text-xs text-text-muted">
                  {slot.windSpeedMph} mph {slot.windDirection}
                </span>
                <span className="text-xs font-semibold text-green">{slot.temperatureF}°F</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
