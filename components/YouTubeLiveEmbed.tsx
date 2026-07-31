import type { YouTubeStream } from '@/lib/fetchYouTubeStreams';

interface YouTubeLiveEmbedProps {
  stream: YouTubeStream;
}

export default function YouTubeLiveEmbed({ stream }: YouTubeLiveEmbedProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-default)] border border-border bg-black shadow-[var(--shadow-card)]">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${stream.id}?autoplay=0`}
          title={stream.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
