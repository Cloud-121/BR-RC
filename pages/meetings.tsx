import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import HeroStrip from '@/components/HeroStrip';
import MeetingsNotice from '@/components/MeetingsNotice';
import MeetingsGate from '@/components/MeetingsGate';
import YouTubeStreamCard from '@/components/YouTubeStreamCard';
import YouTubeLiveEmbed from '@/components/YouTubeLiveEmbed';
import YouTubeEmbedModal from '@/components/YouTubeEmbedModal';
import {
  fetchYouTubeStreams,
  type YouTubeStream,
  type YouTubeStreamsResult,
} from '@/lib/fetchYouTubeStreams';
import { YOUTUBE_CHANNEL_URL } from '@/lib/youtubeChannel';
import { serializeProps } from '@/lib/serializeProps';

interface MeetingsProps {
  channelUrl: string;
  live: YouTubeStream | null;
  upcoming: YouTubeStream[];
  past: YouTubeStream[];
  loadError: string | null;
}

export const getServerSideProps: GetServerSideProps<MeetingsProps> = async () => {
  let channelUrl = YOUTUBE_CHANNEL_URL;
  let live: YouTubeStream | null = null;
  let upcoming: YouTubeStream[] = [];
  let past: YouTubeStream[] = [];
  let loadError: string | null = null;

  try {
    const streams: YouTubeStreamsResult = await fetchYouTubeStreams();
    channelUrl = streams.channelUrl;
    live = streams.live;
    upcoming = streams.upcoming;
    past = streams.past;
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Couldn't load meeting streams right now.";
  }

  return { props: serializeProps({ channelUrl, live, upcoming, past, loadError }) };
};

export default function Meetings({
  channelUrl,
  live,
  upcoming,
  past,
  loadError,
}: MeetingsProps) {
  const [selected, setSelected] = useState<YouTubeStream | null>(null);
  const hasStreams = live || upcoming.length > 0 || past.length > 0;

  return (
    <Layout
      title="Meetings"
      description="Club meeting schedule and live streams from Baton Rouge RC Club on YouTube."
    >
      <HeroStrip headline="Club Meetings" showButton={false} compact imageSrc="/images/contact.jpg" />

      <main className="mx-auto max-w-content px-5 py-10 pb-14 max-md:px-4 max-md:py-8">
        <MeetingsGate>
          <MeetingsNotice />

          {loadError ? (
            <div className="mt-8 rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] border-l-4 border-l-rust max-md:p-6">
              <p>{loadError}</p>
              <p>
                <a href={channelUrl} target="_blank" rel="noopener noreferrer">
                  Watch on YouTube
                </a>
              </p>
            </div>
          ) : (
            <>
              {live && (
                <section className="mt-8">
                  <h2 className="mb-4 text-2xl">Live now</h2>
                  <YouTubeLiveEmbed stream={live} />
                  <p className="mt-3 text-text-muted">{live.title}</p>
                </section>
              )}

              {upcoming.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-4 text-2xl">Upcoming live streams</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {upcoming.map((stream) => (
                      <YouTubeStreamCard
                        key={stream.id}
                        stream={stream}
                        onSelect={setSelected}
                      />
                    ))}
                  </div>
                </section>
              )}

              {past.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-4 text-2xl">Past live streams</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {past.map((stream) => (
                      <YouTubeStreamCard
                        key={stream.id}
                        stream={stream}
                        onSelect={setSelected}
                      />
                    ))}
                  </div>
                </section>
              )}

              {!hasStreams && (
                <div className="mt-8 rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] max-md:p-6">
                  <p className="m-0">No meeting streams are listed right now.</p>
                </div>
              )}
            </>
          )}
        </MeetingsGate>
      </main>

      <YouTubeEmbedModal stream={selected} onClose={() => setSelected(null)} />
    </Layout>
  );
}
