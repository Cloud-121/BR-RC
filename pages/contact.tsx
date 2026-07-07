import Link from 'next/link';
import Layout from '@/components/Layout';
import HeroStrip from '@/components/HeroStrip';
import MeetingsNotice from '@/components/MeetingsNotice';
import CtaBanner from '@/components/CtaBanner';
import { FIELD_GOOGLE_MAPS_URL } from '@/lib/fieldLocation';

export default function Contact() {
  return (
    <Layout
      title="Contact"
      description="Contact the Baton Rouge RC Club — club officers, field location, and Facebook group."
    >
      <HeroStrip headline="Contact" showButton={false} compact imageSrc="/images/contact.jpg" />

      <main className="mx-auto max-w-content px-5 py-10 pb-14 max-md:px-4 max-md:py-8">
        <div className="rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] max-md:p-6">
          <section className="mb-8 last:mb-0">
            <h2>Club Officers</h2>
            <ul className="list-none p-0">
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">President</strong>
                <span>Lester May</span>
              </li>
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Vice President</strong>
                <span>Rick Bellelo</span>
              </li>
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Treasurer</strong>
                <span>Phillip Juneau</span>
              </li>
              <li className="grid gap-1 py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Secretary</strong>
                <span>Jeffery Pike</span>
              </li>
            </ul>
          </section>

          <section className="mb-8 last:mb-0">
            <h2>Kissner Field</h2>
            <ul className="list-none p-0">
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Address</strong>
                <span>8940 Ronald Reagan Highway, Port Allen, LA 70767</span>
              </li>
              <li className="grid gap-1 py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Map</strong>
                <a href={FIELD_GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
              </li>
            </ul>
            <p>
              <Link
                href="/kissner-field"
                className="inline-block rounded-md bg-rust px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-rust-dark hover:text-white"
              >
                Field details &amp; hours
              </Link>
            </p>
          </section>

          <MeetingsNotice compact />
        </div>

        <CtaBanner>
          <a
            href="https://www.facebook.com/groups/BRRCC"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-cream underline underline-offset-4 hover:text-white"
          >
            Join our Facebook group.
          </a>
        </CtaBanner>
      </main>
    </Layout>
  );
}
