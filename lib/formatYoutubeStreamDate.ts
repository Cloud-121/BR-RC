import { FIELD_TIMEZONE } from './fieldLocation';

export function formatYoutubeStreamDate(
  isoDate: string | null | undefined,
  fallback?: string,
): string {
  if (!isoDate) return fallback ?? '';

  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return fallback ?? isoDate;

  return new Date(parsed).toLocaleString('en-US', {
    timeZone: FIELD_TIMEZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
