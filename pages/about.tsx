import Layout from '@/components/Layout';
import HeroStrip from '@/components/HeroStrip';
import AboutConsoleEasterEgg from '@/components/AboutConsoleEasterEgg';
import { MEETING_LIBRARY_GOOGLE_MAPS_URL, MEETING_LIBRARY_NAME } from '@/lib/fieldLocation';

export default function About() {
  return (
    <Layout
      title="About Us"
      description="About the Baton Rouge Radio Control Club — AMA chartered club with nearly 40 years at Kissner Field."
    >
      <AboutConsoleEasterEgg />
      <HeroStrip headline="About Us" showButton={false} compact imageSrc="/images/hero-strip.jpg" />

      <main className="mx-auto max-w-content px-5 py-10 pb-14 max-md:px-4 max-md:py-8">
        <div className="rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] max-md:p-6">
          <section className="mb-8 last:mb-0">
            <h2>Our Club</h2>
            <p>
              The Baton Rouge Radio Control Club (BRRCC) is an Academy of Model Aeronautics (AMA)
              chartered club that has been flying at Kissner Field for nearly 40 years.
            </p>
            <p>
              Our members include hobbyists who build their own planes, casual flyers who come out for
              fun, and builders. Guests and the general public are welcome.
            </p>
            <p>AMA membership is required to fly at the field.</p>
          </section>

          <section className="mb-8 last:mb-0">
            <h2>Member Meetings</h2>
            <ul className="list-none p-0">
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">When</strong>
                <span>1st Tuesday of each month, 6:30 PM</span>
              </li>
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Where</strong>
                <a
                  href={MEETING_LIBRARY_GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {MEETING_LIBRARY_NAME}
                </a>
              </li>
              <li className="grid gap-1 py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Who</strong>
                <span>The public is welcome</span>
              </li>
            </ul>
            <p>
              Meeting details are also posted on our{' '}
              <a href="https://www.facebook.com/groups/BRRCC" target="_blank" rel="noopener noreferrer">
                Facebook group
              </a>
              .
            </p>
          </section>

          <section className="mb-8 last:mb-0">
            <h2>Join the Club</h2>
            <p>New members are welcome.</p>
            <ol className="my-4 list-decimal space-y-2 pl-5">
              <li>
                Make sure you have an active{' '}
                <a href="https://www.modelaircraft.org" target="_blank" rel="noopener noreferrer">
                  AMA membership
                </a>
                .
              </li>
              <li>Download and fill out the BRRCC membership form.</li>
              <li>
                Bring your form printed, with your AMA card, and a check payable to BRRCC to the
                club meeting.
              </li>
            </ol>
            <ul className="list-none p-0">
              <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">New members</strong>
                <span>$140 first year</span>
              </li>
              <li className="grid gap-1 py-3 md:grid-cols-[9rem_1fr] md:gap-3">
                <strong className="font-semibold text-green">Renewals</strong>
                <span>$125 per calendar year</span>
              </li>
            </ul>
            <p>
              <a
                href="/BRRCCMembershipForm.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-rust px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-rust-dark hover:text-white"
              >
                Download membership form (PDF)
              </a>
            </p>
          </section>

          <section>
            <h2>AMA Membership</h2>
            <p>
              AMA membership is required to fly at Kissner Field. Visit{' '}
              <a href="https://www.modelaircraft.org" target="_blank" rel="noopener noreferrer">
                modelaircraft.org
              </a>{' '}
              to join or renew.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}
