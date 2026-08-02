import { useEffect, useId, useRef } from 'react';
import type { YouTubeStream } from '@/lib/fetchYouTubeStreams';
import YouTubeLiveEmbed from './YouTubeLiveEmbed';

interface YouTubeEmbedModalProps {
  stream: YouTubeStream | null;
  onClose: () => void;
}

export default function YouTubeEmbedModal({ stream, onClose }: YouTubeEmbedModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!stream) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [stream, onClose]);

  if (!stream) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 max-md:p-2"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-3xl rounded-[var(--radius-default)] bg-white p-4 shadow-[var(--shadow-card)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h2 id={titleId} className="mb-0 text-base text-green sm:text-lg">
            {stream.title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-text-muted hover:border-green-light hover:text-green"
          >
            Close
          </button>
        </div>
        <YouTubeLiveEmbed stream={stream} autoplay />
      </div>
    </div>
  );
}
