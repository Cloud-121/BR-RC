import { FIELD_TIMEZONE } from './fieldLocation';

/** Parse Facebook event date strings like "Sat, Nov 15, 2025" or "Sat, Jun 13". */
export function parseEventDateString(dateStr: string): Date | null {
  const direct = Date.parse(dateStr);
  if (!Number.isNaN(direct)) {
    return new Date(direct);
  }

  const withoutYear = dateStr.match(/^[A-Za-z]{3},\s+([A-Za-z]{3})\s+(\d{1,2})$/);
  if (withoutYear) {
    const [, month, day] = withoutYear;
    const now = new Date();
    let candidate = new Date(`${month} ${day}, ${now.getFullYear()}`);
    if (candidate.getTime() < now.getTime()) {
      candidate = new Date(`${month} ${day}, ${now.getFullYear() + 1}`);
    }
    if (!Number.isNaN(candidate.getTime())) {
      return candidate;
    }
  }

  return null;
}

export function isFutureEventDate(dateStr: string): boolean {
  const parsed = parseEventDateString(dateStr);
  if (!parsed) return false;
  return parsed.getTime() > Date.now();
}

export function formatEventDate(dateStr: string): string {
  const parsed = parseEventDateString(dateStr);
  if (!parsed) return dateStr;

  return parsed.toLocaleString('en-US', {
    timeZone: FIELD_TIMEZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
