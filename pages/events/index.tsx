import type { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import HeroStrip from '@/components/HeroStrip';
import EventCard from '@/components/EventCard';
import MeetingsNotice from '@/components/MeetingsNotice';
import CtaBanner from '@/components/CtaBanner';
import { fetchGroupEvents, type ClubEvent } from '@/lib/fetchGroupEvents';
import { serializeProps } from '@/lib/serializeProps';

const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/BRRCC';
const FACEBOOK_GROUP_EVENTS_URL = 'https://www.facebook.com/groups/BRRCC/events';

interface EventsProps {
  events: ClubEvent[];
  loadError: string | null;
}

export const getServerSideProps: GetServerSideProps<EventsProps> = async () => {
  let events: ClubEvent[] = [];
  let loadError: string | null = null;

  try {
    events = await fetchGroupEvents();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : 'Unable to load events from Facebook right now.';
  }

  return { props: serializeProps({ events, loadError }) };
};

export default function Events({ events, loadError }: EventsProps) {
  return (
    <Layout
      title="Events"
      description="Upcoming events at Baton Rouge RC Club — fly-ins and competitions at Kissner Field."
    >
      <HeroStrip headline="Events" showButton={false} compact />

      <main className="mx-auto max-w-content px-5 py-10 pb-14 max-md:px-4 max-md:py-8">
        <div className="rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] max-md:p-6">
          <p>
            Upcoming events from our Facebook group are listed below.
          </p>
        </div>

        <MeetingsNotice compact />

        {loadError ? (
          <div className="mt-8 rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] border-l-4 border-l-rust max-md:p-6">
            <p>{loadError}</p>
            <p>
              <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer">
                View events on Facebook
              </a>
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="mt-8 rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] max-md:p-6">
            <p>No upcoming events are listed on Facebook right now.</p>
            <p>
              <a href={FACEBOOK_GROUP_EVENTS_URL} target="_blank" rel="noopener noreferrer">
                View the BRRCC events page on Facebook
              </a>{' '}
              for the latest announcements, or check the main{' '}
              <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer">
                Facebook group
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="mt-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {!loadError && events.length > 0 && (
          <CtaBanner>
            More details and additional announcements on{' '}
            <a
              href={FACEBOOK_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-cream underline underline-offset-4 hover:text-white"
            >
              our Facebook group
            </a>
            .
          </CtaBanner>
        )}
      </main>
    </Layout>
  );
}
