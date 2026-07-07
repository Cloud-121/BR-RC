import type { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import HeroStrip from '@/components/HeroStrip';
import { FilterableMediaGrid } from '@/components/MediaGrid';
import CtaBanner from '@/components/CtaBanner';
import { fetchGroupMedia, type ClubMediaItem } from '@/lib/fetchGroupMedia';
import { serializeProps } from '@/lib/serializeProps';

const FACEBOOK_GROUP_MEDIA_URL = 'https://www.facebook.com/groups/BRRCC/media';
const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/BRRCC';

interface MediaPageProps {
  media: ClubMediaItem[];
  loadError: string | null;
}

export const getServerSideProps: GetServerSideProps<MediaPageProps> = async () => {
  let media: ClubMediaItem[] = [];
  let loadError: string | null = null;

  try {
    media = await fetchGroupMedia();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : 'Unable to load media from Facebook right now.';
  }

  return { props: serializeProps({ media, loadError }) };
};

export default function MediaPage({ media, loadError }: MediaPageProps) {
  return (
    <Layout
      title="Media"
      description="Photos and videos from the Baton Rouge RC Club — fly days, events, and life at Kissner Field."
    >
      <HeroStrip headline="Media" showButton={false} compact imageSrc="/images/media.jpg" />

      <main className="mx-auto max-w-content px-5 py-10 pb-14 max-md:px-4 max-md:py-8">
        <div className="rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] max-md:p-6">
          <p>
            Recent photos and videos shared by club members in our Facebook group, fly days at Kissner
            Field and events
          </p>
        </div>

        {loadError ? (
          <div className="mt-8 rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] border-l-4 border-l-rust max-md:p-6">
            <p>{loadError}</p>
            <p>
              <a href={FACEBOOK_GROUP_MEDIA_URL} target="_blank" rel="noopener noreferrer">
                View media on Facebook
              </a>
            </p>
          </div>
        ) : media.length === 0 ? (
          <div className="mt-8 rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] max-md:p-6">
            <p>No photos or videos posted yet.</p>
            <p>
              <a href={FACEBOOK_GROUP_MEDIA_URL} target="_blank" rel="noopener noreferrer">
                Check the BRRCC Facebook group
              </a>{' '}
              for the latest media.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <FilterableMediaGrid media={media} />
          </div>
        )}

        {!loadError && media.length > 0 && (
          <CtaBanner>
            More photos and videos on{' '}
            <a
              href={FACEBOOK_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-cream underline underline-offset-4 hover:text-white"
            >
              our Facebook group
            </a>
            .
          </CtaBanner>
        )}
      </main>
    </Layout>
  );
}
