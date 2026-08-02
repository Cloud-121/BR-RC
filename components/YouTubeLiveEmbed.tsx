import type { YouTubeStream } from '@/lib/fetchYouTubeStreams';

interface YouTubeLiveEmbedProps {
  stream: YouTubeStream;
  autoplay?: boolean;
}

export default function YouTubeLiveEmbed({ stream, autoplay = false }: YouTubeLiveEmbedProps) {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
  });

  return (
    <div className="overflow-hidden rounded-[var(--radius-default)] border border-border bg-black shadow-[var(--shadow-card)]">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${stream.id}?${params.toString()}`}
          title={stream.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
