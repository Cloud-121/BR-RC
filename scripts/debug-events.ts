import { EventType, scrapeFbEventList } from 'facebook-event-scraper';

const url = process.env.FACEBOOK_GROUP_EVENTS_URL ?? 'https://www.facebook.com/groups/BRRCC/events';

async function debugEvents() {
  for (const type of [EventType.Upcoming, EventType.Past] as const) {
    console.log(`\n=== ${type} ===`);
    try {
      const raw = await scrapeFbEventList(url, type);
      console.log(`Raw count: ${raw.length}`);
      for (const event of raw.slice(0, 5)) {
        console.log({
          id: event.id,
          name: event.name,
          date: event.date,
          isPast: event.isPast,
          isCanceled: event.isCanceled,
        });
      }
    } catch (error) {
      console.error(`Failed (${type}):`, error instanceof Error ? error.message : error);
    }
  }
}

debugEvents();
