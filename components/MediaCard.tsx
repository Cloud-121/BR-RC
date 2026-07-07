import { getMediaThumbnailUrl, type ClubMediaItem } from '@/lib/fetchGroupMedia';
import { cn } from '@/lib/cn';

interface MediaCardProps {
  item: ClubMediaItem;
  hidden?: boolean;
  onOpen?: (item: ClubMediaItem) => void;
}

function MediaThumbnail({ item, label }: { item: ClubMediaItem; label: string }) {
  const thumbnailUrl = getMediaThumbnailUrl(item.id, item.type);

  return (
    <>
      <img
        src={thumbnailUrl}
        alt={label}
        loading="lazy"
        width={280}
        height={280}
        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
      />
      {item.type === 'video' && (
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-green/35 text-white"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-11 w-11 drop-shadow-md">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}
    </>
  );
}

export default function MediaCard({ item, hidden = false, onOpen }: MediaCardProps) {
  const isVideo = item.type === 'video';
  const label =
    item.caption ??
    (isVideo ? 'Video from BRRCC Facebook group' : 'Photo from BRRCC Facebook group');

  const className = cn(
    'group relative block aspect-square overflow-hidden rounded-[var(--radius-default)] border border-border bg-white shadow-[var(--shadow-card)] no-underline',
    hidden && 'hidden',
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={() => onOpen(item)}
        className={cn(className, 'w-full cursor-pointer p-0 text-left')}
        aria-label={isVideo ? `Play video: ${label}` : `View photo: ${label}`}
        data-type={item.type}
      >
        <MediaThumbnail item={item} label={label} />
      </button>
    );
  }

  return (
    <a
      href={item.postUrl}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      data-type={item.type}
    >
      <MediaThumbnail item={item} label={label} />
    </a>
  );
}
