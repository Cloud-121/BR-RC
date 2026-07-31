import type { MetricStatus } from '@/lib/flyability';
import { cn } from '@/lib/cn';

interface WeatherMetricTileProps {
  label: string;
  value: string;
  status?: MetricStatus;
  className?: string;
}

export default function WeatherMetricTile({
  label,
  value,
  status = 'ok',
  className,
}: WeatherMetricTileProps) {
  const isWarning = status === 'warning';

  return (
    <div
      className={cn(
        'flex min-h-[5.5rem] flex-col justify-between rounded-[var(--radius-default)] border px-4 py-3',
        isWarning
          ? 'border-rust/30 bg-[#f8ebe3] text-rust'
          : 'border-green-pale bg-green-pale/40 text-green',
        className,
      )}
    >
      <span
        className={cn(
          'text-xs font-semibold uppercase tracking-wide',
          isWarning ? 'text-rust/80' : 'text-green-light',
        )}
      >
        {label}
      </span>
      <span className="text-[1.1rem] font-bold leading-tight">{value}</span>
    </div>
  );
}
