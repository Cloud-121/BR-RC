import { getMediaThumbnailUrl, type ClubMediaItem } from '@/lib/fetchGroupMedia';
import { cn } from '@/lib/cn';

interface MediaCardProps {
  item: ClubMediaItem;
  hidden?: boolean;
}

export default function MediaCard({ item, hidden = false }: MediaCardProps) {
  const label =
    item.caption ??
    (item.type === 'video' ? 'Video from BRRCC Facebook group' : 'Photo from BRRCC Facebook group');
  const thumbnailUrl = getMediaThumbnailUrl(item.id, item.type);

  return (
    <a
      href={item.postUrl}
      className={cn(
        'relative block aspect-square overflow-hidden rounded-[var(--radius-default)] border border-border bg-white shadow-[var(--shadow-card)] no-underline',
        hidden && 'hidden',
      )}
      target="_blank"
      rel="noopener noreferrer"
      data-type={item.type}
    >
      <img
        src={thumbnailUrl}
        alt={label}
        loading="lazy"
        width={280}
        height={280}
        className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.03]"
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
    </a>
  );
}
