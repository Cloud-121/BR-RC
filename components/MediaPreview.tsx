import Link from 'next/link';
import type { ClubMediaItem } from '@/lib/fetchGroupMedia';
import MediaGrid from './MediaGrid';

const FACEBOOK_GROUP_MEDIA_URL = 'https://www.facebook.com/groups/BRRCC/media';

interface MediaPreviewProps {
  media?: ClubMediaItem[];
  error?: string | null;
}

export default function MediaPreview({ media = [], error = null }: MediaPreviewProps) {
  return (
    <section className="mt-10" aria-labelledby="media-preview-heading">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="media-preview-heading" className="mb-0">
          From the Field
        </h2>
        <Link href="/media" className="font-semibold no-underline hover:underline hover:underline-offset-4">
          View all media
        </Link>
      </div>

      {error ? (
        <p className="mt-4 text-text-muted">
          Photos and videos are shared in our{' '}
          <a href={FACEBOOK_GROUP_MEDIA_URL} target="_blank" rel="noopener noreferrer">
            Facebook group
          </a>
          .
        </p>
      ) : media.length === 0 ? (
        <p className="mt-4 text-text-muted">
          No recent photos or videos yet. Check our{' '}
          <a href={FACEBOOK_GROUP_MEDIA_URL} target="_blank" rel="noopener noreferrer">
            Facebook group
          </a>
          .
        </p>
      ) : (
        <MediaGrid media={media} />
      )}
    </section>
  );
}
