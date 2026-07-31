import type { YouTubeStream } from '@/lib/fetchYouTubeStreams';
import { formatYoutubeStreamDate } from '@/lib/formatYoutubeStreamDate';
import { cn } from '@/lib/cn';

interface YouTubeStreamCardProps {
  stream: YouTubeStream;
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

export default function YouTubeStreamCard({ stream }: YouTubeStreamCardProps) {
  const dateLabel =
    stream.status === 'upcoming'
      ? formatYoutubeStreamDate(stream.scheduledStartTime, stream.detailText)
      : formatYoutubeStreamDate(stream.publishedAt, stream.detailText);

  return (
    <article className="rounded-[var(--radius-default)] border border-border bg-white p-5 shadow-[var(--shadow-card)]">
      <a
        href={stream.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 block overflow-hidden rounded-md no-underline"
      >
        <img
          src={stream.thumbnailUrl}
          alt=""
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      </a>
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
        <a
          href={stream.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green no-underline hover:text-rust"
        >
          {stream.title}
        </a>
      </h3>
      <a
        href={stream.url}
        className="inline-block rounded-md bg-rust px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-rust-dark hover:text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch on YouTube
      </a>
    </article>
  );
}
