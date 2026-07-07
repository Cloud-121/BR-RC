import { EventType, scrapeFbEventList, type ScrapeOptions } from 'facebook-event-scraper';
import { isFutureEventDate } from './formatEventDate';

export interface ClubEvent {
  id: string;
  title: string;
  startTime: string;
  url: string;
  location?: string;
  description?: string;
}

export class FacebookEventsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'FacebookEventsError';
  }
}

const DEFAULT_GROUP_EVENTS_URL = 'https://www.facebook.com/groups/BRRCC/events';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

let eventsCache: { events: ClubEvent[]; expiresAt: number } | null = null;

function getScrapeOptions(): ScrapeOptions | undefined {
  const proxyUrl = process.env.HTTP_PROXY;
  if (!proxyUrl) return undefined;

  try {
    const parsed = new URL(proxyUrl);
    return {
      proxy: {
        host: parsed.hostname,
        port: Number(parsed.port) || (parsed.protocol === 'https:' ? 443 : 80),
        protocol: parsed.protocol.replace(':', ''),
        auth:
          parsed.username && parsed.password
            ? { username: parsed.username, password: parsed.password }
            : undefined,
      },
    };
  } catch {
    return undefined;
  }
}

function getGroupEventsUrl(): string {
  return process.env.FACEBOOK_GROUP_EVENTS_URL ?? DEFAULT_GROUP_EVENTS_URL;
}

function normalizeEvent(event: {
  id: string;
  name: string;
  url: string;
  date: string;
  isCanceled: boolean;
  isPast: boolean;
}): ClubEvent | null {
  if (event.isCanceled) return null;
  if (event.isPast && !isFutureEventDate(event.date)) return null;

  return {
    id: event.id,
    title: event.name,
    startTime: event.date,
    url: event.url,
  };
}

async function scrapeGroupEvents(): Promise<ClubEvent[]> {
  const url = getGroupEventsUrl();
  const options = getScrapeOptions();
  const rawEvents = await scrapeFbEventList(url, EventType.Upcoming, options);

  return rawEvents
    .map(normalizeEvent)
    .filter((event): event is ClubEvent => event !== null);
}

async function getCachedEvents(): Promise<ClubEvent[]> {
  const now = Date.now();
  if (eventsCache && eventsCache.expiresAt > now) {
    return eventsCache.events;
  }

  const events = await scrapeGroupEvents();
  eventsCache = { events, expiresAt: now + CACHE_TTL_MS };
  return events;
}

export async function fetchGroupEvents(): Promise<ClubEvent[]> {
  try {
    return await getCachedEvents();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error while fetching Facebook events';
    throw new FacebookEventsError(`Failed to load events from Facebook: ${message}`, {
      cause: error,
    });
  }
}
