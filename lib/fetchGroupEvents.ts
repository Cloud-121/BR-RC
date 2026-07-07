import { EventType, scrapeFbEventList, type ScrapeOptions } from 'facebook-event-scraper';

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
  if (event.isCanceled || event.isPast) return null;

  return {
    id: event.id,
    title: event.name,
    startTime: event.date,
    url: event.url,
  };
}

export async function fetchGroupEvents(): Promise<ClubEvent[]> {
  const url = getGroupEventsUrl();

  try {
    const rawEvents = await scrapeFbEventList(url, EventType.Upcoming, getScrapeOptions());
    return rawEvents
      .map(normalizeEvent)
      .filter((event): event is ClubEvent => event !== null);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error while fetching Facebook events';
    throw new FacebookEventsError(`Failed to load events from Facebook: ${message}`, {
      cause: error,
    });
  }
}
