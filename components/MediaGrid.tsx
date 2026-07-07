import { useState } from 'react';
import type { ClubMediaItem } from '@/lib/fetchGroupMedia';
import MediaCard from './MediaCard';
import { cn } from '@/lib/cn';

type Filter = 'all' | 'photo' | 'video';

interface MediaGridProps {
  media: ClubMediaItem[];
  showFilters?: boolean;
}

export default function MediaGrid({ media, showFilters = true }: MediaGridProps) {
  const hasPhotos = media.some((item) => item.type === 'photo');
  const hasVideos = media.some((item) => item.type === 'video');
  const showFilterBar = showFilters && hasPhotos && hasVideos;
  const [filter, setFilter] = useState<Filter>('all');

  return (
    <>
      {showFilterBar && (
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter media">
          {(['all', 'photo', 'video'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              className={cn(
                'cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                filter === value
                  ? 'border-green bg-green text-white'
                  : 'border-border bg-white text-text-muted hover:border-green-light hover:text-green',
              )}
              onClick={() => setFilter(value)}
            >
              {value === 'all' ? 'All' : value === 'photo' ? 'Photos' : 'Videos'}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {media.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            hidden={filter !== 'all' && item.type !== filter}
          />
        ))}
      </div>
    </>
  );
}
