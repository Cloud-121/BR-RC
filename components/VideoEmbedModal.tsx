import { useEffect, useId, useRef, useState } from 'react';
import type { ClubMediaItem } from '@/lib/fetchGroupMedia';
import { getMediaVideoUrl } from '@/lib/fetchVideoSource';

interface VideoEmbedModalProps {
  video: ClubMediaItem | null;
  onClose: () => void;
}

export default function VideoEmbedModal({ video, onClose }: VideoEmbedModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!video) return;

    setLoadState('loading');
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
  }, [video, onClose]);

  if (!video) return null;

  const label = video.caption ?? 'Video from BRRCC Facebook group';
  const videoUrl = getMediaVideoUrl(video.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
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
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 id={titleId} className="mb-0 text-lg text-green">
            {label}
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

        <div className="relative aspect-video overflow-hidden rounded-[var(--radius-default)] bg-black">
          {loadState === 'loading' && (
            <p className="absolute inset-0 flex items-center justify-center text-sm text-white/80">
              Loading video…
            </p>
          )}
          {loadState === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white/90">
              <p className="m-0">This video could not be played here.</p>
              <a
                href={video.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cream underline underline-offset-4 hover:text-white"
              >
                Watch on Facebook
              </a>
            </div>
          )}
          <video
            key={video.id}
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className={loadState === 'error' ? 'hidden' : 'absolute inset-0 h-full w-full bg-black'}
            onLoadedData={() => setLoadState('ready')}
            onError={() => setLoadState('error')}
          >
            Your browser does not support embedded video playback.
          </video>
        </div>

        <p className="mb-0 mt-3 text-sm text-text-muted">
          Videos are streamed from Facebook.{' '}
          <a href={video.postUrl} target="_blank" rel="noopener noreferrer">
            Open on Facebook
          </a>{' '}
          for comments and sharing.
        </p>
      </div>
    </div>
  );
}
