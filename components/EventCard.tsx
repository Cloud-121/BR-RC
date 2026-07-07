import type { ClubEvent } from '@/lib/fetchGroupEvents';
import { formatEventDate } from '@/lib/formatEventDate';

interface EventCardProps {
  event: ClubEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="mb-4 rounded-[var(--radius-default)] border border-border bg-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="mb-1">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green no-underline hover:text-rust"
        >
          {event.title}
        </a>
      </h3>
      <p className="mb-3 text-[0.95rem] font-bold text-rust">{formatEventDate(event.startTime)}</p>
      {event.location && <p>{event.location}</p>}
      {event.description && <p>{event.description}</p>}
      <a
        href={event.url}
        className="inline-block rounded-md bg-rust px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-rust-dark hover:text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Facebook
      </a>
    </article>
  );
}
