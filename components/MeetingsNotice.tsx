import Link from 'next/link';
import { cn } from '@/lib/cn';

interface MeetingsNoticeProps {
  compact?: boolean;
}

const when = '1st Tuesday of each month, 6:30 PM';
const where = 'East Baton Rouge Parish Main Branch Library';

export default function MeetingsNotice({ compact = false }: MeetingsNoticeProps) {
  return (
    <aside
      className={cn(
        'mb-6 rounded-[var(--radius-default)] border border-border bg-white p-6 shadow-[var(--shadow-card)] border-l-4 border-l-green-light',
        compact && '[&_p:last-child]:mb-0',
      )}
    >
      <h2 className="mb-2.5 text-xl">Club Meetings</h2>
      {compact ? (
        <p>
          We meet every <strong>{when}</strong> at the {where}. The public is welcome.
        </p>
      ) : (
        <>
          <p>
            We hold club meetings every <strong>first Tuesday of the month</strong> at{' '}
            <strong>6:30 PM</strong>. The public is welcome — come to a meeting to learn about
            membership.
          </p>
          <ul className="mt-3 list-none p-0">
            <li className="grid gap-1 border-b border-cream-dark py-3 md:grid-cols-[9rem_1fr] md:gap-3">
              <strong className="font-semibold text-green">When</strong>
              <span>{when}</span>
            </li>
            <li className="grid gap-1 py-3 md:grid-cols-[9rem_1fr] md:gap-3">
              <strong className="font-semibold text-green">Where</strong>
              <span>{where}</span>
            </li>
          </ul>
        </>
      )}
      <p>
        <Link href="/about">More about the club</Link>
      </p>
    </aside>
  );
}
