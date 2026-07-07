import Layout from '@/components/Layout';
import HeroStrip from '@/components/HeroStrip';
import { MEETING_LIBRARY_GOOGLE_MAPS_URL, MEETING_LIBRARY_NAME } from '@/lib/fieldLocation';

export default function About() {
  return (
    <Layout
      title="About Us"
      description="About the Baton Rouge Radio Control Club — AMA chartered club with nearly 40 years at Kissner Field."
    >
      <HeroStrip headline="About Us" showButton={false} compact />

      <main className="mx-auto max-w-content px-5 py-10 pb-14">
        <div className="rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] max-md:p-6">
          <section className="mb-8 last:mb-0">
            <h2>Our Club</h2>
            <p>
              The Baton Rouge Radio Control Club (BRRCC) is an Academy of Model Aeronautics (AMA)
              chartered club that has been flying at Kissner Field for nearly 40 years. We are one of
              the largest dedicated RC clubs in the South, with about 139 members ranging from casual
              weekend flyers to world-class competition pilots.
            </p>
            <p>
              Our members include hobbyists who build their own planes, casual flyers who come out for
              fun, and licensed pilots who share a love of aviation. Guest pilots and the general public
              are welcome — AMA membership is required to fly at the field.
            </p>
          </section>

          <section className="mb-8 last:mb-0">
            <h2>Membership</h2>
            <p>
              BRRCC offers open membership. The public is welcome at our monthly meetings — please attend
              a meeting to learn about joining the club.
            </p>
            <ul>
              <li>Pilot instruction and training available</li>
              <li>Regular club meetings and cookouts</li>
              <li>Events open to other AMA clubs and members</li>
              <li>No drugs or alcohol; model inspection required</li>
            </ul>
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
