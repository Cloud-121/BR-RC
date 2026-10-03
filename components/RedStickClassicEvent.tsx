import { FIELD_GOOGLE_MAPS_URL } from '@/lib/fieldLocation';

const BROCHURE_URL = '/images/brocer.jpg';

export default function RedStickClassicEvent() {
  return (
    <article
      aria-labelledby="red-stick-classic-title"
      className="mb-8 overflow-hidden rounded-[var(--radius-default)] border border-border bg-white shadow-[var(--shadow-card)]"
    >
      <header className="border-b border-border bg-green p-8 text-white max-md:p-6">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-green-pale">
          Baton Rouge Radio Control Club presents
        </p>
        <h2 id="red-stick-classic-title" className="mb-4 text-3xl text-white max-md:text-2xl">
          Red Stick Classic RC Scale Contest
        </h2>
        <p className="mb-2 text-xl font-bold text-cream">
          <time dateTime="2026-10-23">October 23</time>
          {'–'}
          <time dateTime="2026-10-24">24, 2026</time>
        </p>
        <p>Kissner Field · Louisiana</p>
      </header>

      <div className="grid gap-8 p-8 max-md:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div>
          <h3>Schedule</h3>
          <ul className="mb-6 space-y-2">
            <li>
              <strong>Friday, October 23:</strong> Practice flying begins. Registration
              and static judging start at noon.
            </li>
            <li>
              <strong>Saturday, October 24:</strong> Optional registration and static
              judging in the morning. Fellowship dinner that evening, with good
              Louisiana food and children’s activities.
            </li>
          </ul>

          <h3>Contest classes</h3>
          <p className="mb-6">
            Designer Scale, Expert, Sportsman, Open (Advanced), Team Scale,
            Fun Expert, Fun Novice, and Foamy. See the brochure for model and
            static-judging requirements.
          </p>

          <h3>Entry fees</h3>
          <p className="mb-6">
            <strong>$35 for the first event</strong> and <strong>$20 for each
            additional event</strong>. Enter one of Designer, Expert, or Sportsman,
            plus additional Team, Advanced, and/or Fun events, for up to four entries.
          </p>

          <h3>Plan your visit</h3>
          <p>
            Kissner Field is on Highway 190, just east of Erwinville. Primitive
            camping is available without hookups; full hookups are one mile from
            the runway. Hotels are available in Port Allen near Highway 415 and I-10.
          </p>
          <p className="mb-6 text-sm">
            <strong>Contest director:</strong> Jeffrey Pike ·{' '}
            <a href="tel:+12253372037" className="underline underline-offset-4">
              225-337-2037
            </a>
          </p>
          <a
            href={FIELD_GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-rust px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-rust-dark hover:text-white"
          >
            Get field directions
          </a>
        </div>

        <figure className="m-0 min-w-0 self-start rounded-lg border border-border bg-cream p-3">
          <a
            href={BROCHURE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
          >
            <img
              src={BROCHURE_URL}
              alt="Red Stick Classic RC Scale Contest brochure for October 23–24, 2026 at Kissner Field, with contest classes, entry fees, schedule, and contact details."
              width={450}
              height={600}
              className="w-full rounded-sm"
            />
          </a>
          <figcaption className="px-1 pt-4 text-center text-sm text-text-muted">
            <a
              href={BROCHURE_URL}
              download="red-stick-classic-2026-brochure.jpg"
              className="font-semibold underline underline-offset-4"
            >
              Download brochure
            </a>
          </figcaption>
        </figure>
      </div>
    </article>
  );
}
