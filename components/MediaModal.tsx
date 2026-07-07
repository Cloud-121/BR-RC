import { useEffect, useId, useRef, useState } from 'react';
import { getMediaImageUrl, type ClubMediaItem } from '@/lib/fetchGroupMedia';
import { getMediaVideoUrl } from '@/lib/fetchVideoSource';

interface MediaModalProps {
  item: ClubMediaItem | null;
  onClose: () => void;
}

export default function MediaModal({ item, onClose }: MediaModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!item) return;

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
  }, [item, onClose]);

  if (!item) return null;

  const isVideo = item.type === 'video';
  const label =
    item.caption ??
    (isVideo ? 'Video from BRRCC Facebook group' : 'Photo from BRRCC Facebook group');
  const videoUrl = getMediaVideoUrl(item.id);
  const imageUrl = getMediaImageUrl(item.id, item.type, 'full');

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

        <div className="relative flex max-h-[70vh] min-h-[240px] items-center justify-center overflow-hidden rounded-[var(--radius-default)] bg-black">
          {loadState === 'loading' && (
            <p className="absolute inset-0 flex items-center justify-center text-sm text-white/80">
              {isVideo ? 'Loading video…' : 'Loading photo…'}
            </p>
          )}
          {loadState === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white/90">
              <p className="m-0">
                This {isVideo ? 'video' : 'photo'} could not be {isVideo ? 'played' : 'shown'} here.
              </p>
              <a
                href={item.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cream underline underline-offset-4 hover:text-white"
              >
                {isVideo ? 'Watch on Facebook' : 'View on Facebook'}
              </a>
            </div>
          )}

          {isVideo ? (
            <video
              key={item.id}
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className={loadState === 'error' ? 'hidden' : 'h-full max-h-[70vh] w-full bg-black'}
              onLoadedData={() => setLoadState('ready')}
              onError={() => setLoadState('error')}
            >
              Your browser does not support embedded video playback.
            </video>
          ) : (
            <img
              key={item.id}
              src={imageUrl}
              alt={label}
              className={
                loadState === 'error'
                  ? 'hidden'
                  : 'max-h-[70vh] w-auto max-w-full object-contain'
              }
              onLoad={() => setLoadState('ready')}
              onError={() => setLoadState('error')}
            />
          )}
        </div>

        <p className="mb-0 mt-3 text-sm text-text-muted">
          {isVideo ? 'Videos are streamed from Facebook.' : 'Photos are shared in our Facebook group.'}{' '}
          <a href={item.postUrl} target="_blank" rel="noopener noreferrer">
            Open on Facebook
          </a>{' '}
          for comments and sharing.
        </p>
      </div>
    </div>
  );
}
