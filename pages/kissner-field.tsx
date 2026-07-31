import type { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import HeroStrip from '@/components/HeroStrip';
import FieldWeather from '@/components/FieldWeather';
import { fetchFieldWeather, type FieldWeather as FieldWeatherData } from '@/lib/fetchFieldWeather';
import { FIELD_GOOGLE_MAPS_URL } from '@/lib/fieldLocation';
import { serializeProps } from '@/lib/serializeProps';

interface KissnerFieldProps {
  weather: FieldWeatherData | null;
  weatherError: string | null;
}

export const getServerSideProps: GetServerSideProps<KissnerFieldProps> = async () => {
  let weather: FieldWeatherData | null = null;
  let weatherError: string | null = null;

  try {
    weather = await fetchFieldWeather();
  } catch (error) {
    weatherError =
      error instanceof Error
        ? error.message
        : "Couldn't load field weather right now.";
  }

  return { props: serializeProps({ weather, weatherError }) };
};

export default function KissnerField({ weather, weatherError }: KissnerFieldProps) {
  return (
    <Layout
      title="Kissner Field"
      description="Kissner Field — home of the Baton Rouge RC Club in Port Allen, Louisiana. Grass runway, covered shelter, and AMA chartered flying site."
    >
      <HeroStrip
        headline="Kissner Field"
        showButton={false}
        compact
        imageSrc="/images/landing.jpg"
        imagePositionClass="hero-bg--kissner"
      />

      <FieldWeather weather={weather} error={weatherError} />

      <main className="mx-auto max-w-content px-5 py-10 pb-14 max-md:px-4 max-md:py-8">
        <div className="rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] max-md:p-6">
          <section className="mb-8 last:mb-0">
            <h2>About the Field</h2>
            <p>
              Kissner Field sits in West Baton Rouge Parish near Erwinville, Louisiana, and is one
              of the largest dedicated RC fields in the South. The club has operated here for nearly
              40 years on a private airstrip leased from the Kissner family, west of Baton Rouge on
              Highway 190.
            </p>
            <p>
              Members take pride in maintaining the property so it&apos;s ready for flying year-round.
              Spectators and guest pilots are welcome — AMA membership is required to fly.
            </p>
            <p>
              We are an AMA approved flying site and a FRIA approved site. No Remote ID needed.
            </p>
          </section>

          <section className="mb-8 last:mb-0">
            <h2>Location &amp; Directions</h2>
            <ul className="list-none p-0">
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Address</strong>
                <span>8940 Ronald Reagan Highway, Port Allen, LA 70767</span>
              </li>
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">GPS</strong>
                <span>30.503459, -91.349838</span>
              </li>
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Landmark</strong>
                <span>
                  Directly across the street from Tiger Trailer work park — look for the Tiger
                  Statue. About 2 miles from State Capitol Raceway.
                </span>
              </li>
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Directions</strong>
                <span>
                  Look for the white sign with black letters right off the highway stating
                  &quot;Kissner Field.&quot; Turn there, cross the tracks onto a gravel road, and
                  follow it until it dead ends at our field.{" "}
                  <a href={FIELD_GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                    View on Google Maps
                  </a>
                </span>
              </li>
              <li className="grid gap-1 py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Popular flying days</strong>
                <span>Thursday, Saturday, and Sunday — weather permitting</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}
