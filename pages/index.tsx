import type { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import HeroStrip from '@/components/HeroStrip';
import InfoCard from '@/components/InfoCard';
import MeetingsNotice from '@/components/MeetingsNotice';
import FieldWeather from '@/components/FieldWeather';
import MediaPreview from '@/components/MediaPreview';
import CtaBanner from '@/components/CtaBanner';
import { fetchFieldWeather, type FieldWeather as FieldWeatherData } from '@/lib/fetchFieldWeather';
import { fetchGroupMedia, type ClubMediaItem } from '@/lib/fetchGroupMedia';
import { serializeProps } from '@/lib/serializeProps';

interface HomeProps {
  weather: FieldWeatherData | null;
  weatherError: string | null;
  mediaPreview: ClubMediaItem[];
  mediaError: string | null;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  let weather: FieldWeatherData | null = null;
  let weatherError: string | null = null;
  let mediaPreview: ClubMediaItem[] = [];
  let mediaError: string | null = null;

  try {
    weather = await fetchFieldWeather();
  } catch (error) {
    weatherError =
      error instanceof Error
        ? error.message
        : 'Unable to load current field weather right now.';
  }

  try {
    mediaPreview = await fetchGroupMedia({ limit: 6 });
  } catch (error) {
    mediaError =
      error instanceof Error
        ? error.message
        : 'Unable to load recent photos and videos right now.';
  }

  return {
    props: serializeProps({ weather, weatherError, mediaPreview, mediaError }),
  };
};

export default function Home({ weather, weatherError, mediaPreview, mediaError }: HomeProps) {
  return (
    <Layout title="Home">
      <HeroStrip subtitle="AMA chartered club, Fixed wing, helicopters, EDF's, FPV, and more." />

      <main className="mx-auto max-w-wide px-5 py-10 pb-14 max-md:px-4 max-md:py-8 max-md:pb-10">
        <MeetingsNotice compact />
        <FieldWeather weather={weather} error={weatherError} compact />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InfoCard title="Kissner Field" href="/kissner-field">
            Situated in West Baton Rouge Parish, Kissner Field is one of the largest dedicated RC
            fields in the South — grass runways, covered shelter, and room for everyone.
          </InfoCard>
          <InfoCard title="Join the Club" href="/about">
            Meetings are the 1st Tuesday of each month at 6:30 PM. The public is welcome — come to a
            meeting to learn about membership.
          </InfoCard>
        </div>

        <MediaPreview media={mediaPreview} error={mediaError} />

        <CtaBanner>
          <a
            href="https://www.facebook.com/groups/BRRCC"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-cream underline underline-offset-4 hover:text-white"
          >
            Join the BRRCC Facebook group.
          </a>
        </CtaBanner>
      </main>
    </Layout>
  );
}
