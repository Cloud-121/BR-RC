import type { YouTubeStream } from '@/lib/fetchYouTubeStreams';
import { formatYoutubeStreamDate } from '@/lib/formatYoutubeStreamDate';
import { cn } from '@/lib/cn';

interface YouTubeStreamCardProps {
  stream: YouTubeStream;
  onSelect: (stream: YouTubeStream) => void;
}

function statusLabel(status: YouTubeStream['status']): string {
  switch (status) {
    case 'live':
      return 'Live now';
    case 'upcoming':
      return 'Upcoming';
    case 'completed':
      return 'Past stream';
  }
}

function statusBadgeClass(status: YouTubeStream['status']): string {
  switch (status) {
    case 'live':
      return 'bg-rust text-white';
    case 'upcoming':
      return 'bg-green text-white';
    case 'completed':
      return 'bg-cream-dark text-text';
  }
}

export default function YouTubeStreamCard({ stream, onSelect }: YouTubeStreamCardProps) {
  const dateLabel =
    stream.status === 'upcoming'
      ? formatYoutubeStreamDate(stream.scheduledStartTime, stream.detailText)
      : formatYoutubeStreamDate(stream.publishedAt, stream.detailText);

  return (
    <article className="rounded-[var(--radius-default)] border border-border bg-white p-5 shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={() => onSelect(stream)}
        className="mb-3 block w-full cursor-pointer overflow-hidden rounded-md border-0 bg-transparent p-0 text-left"
      >
        <img
          src={stream.thumbnailUrl}
          alt=""
          className="aspect-video w-full object-cover transition-opacity hover:opacity-90"
          loading="lazy"
        />
      </button>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
            statusBadgeClass(stream.status),
          )}
        >
          {statusLabel(stream.status)}
        </span>
        {dateLabel && <span className="text-sm font-semibold text-rust">{dateLabel}</span>}
      </div>
      <h3 className="mb-3 text-lg">
        <button
          type="button"
          onClick={() => onSelect(stream)}
          className="cursor-pointer border-0 bg-transparent p-0 text-left font-heading text-lg font-bold text-green hover:text-rust"
        >
          {stream.title}
        </button>
      </h3>
      <button
        type="button"
        onClick={() => onSelect(stream)}
        className="inline-block cursor-pointer rounded-md border-0 bg-rust px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rust-dark"
      >
        Watch
      </button>
    </article>
  );
}
