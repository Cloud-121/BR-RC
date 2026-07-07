import type { Flyability } from '@/lib/flyability';
import { cn } from '@/lib/cn';

interface FlyabilityBadgeProps {
  flyability: Flyability;
  compact?: boolean;
}

export default function FlyabilityBadge({ flyability, compact = false }: FlyabilityBadgeProps) {
  const isGood = flyability === 'good';

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-[var(--radius-default)] px-3.5 py-2.5 text-[0.95rem] font-semibold',
        isGood ? 'bg-green-pale text-green-light' : 'bg-[#f8ebe3] text-rust',
        compact && 'mb-0 max-w-[9.5rem] shrink-0 text-center text-[0.85rem]',
      )}
    >
      {isGood ? (
        <svg
          className="h-5 w-5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M7.5 12.5 L10.5 15.5 L16.5 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7 V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1.25" fill="currentColor" />
        </svg>
      )}
      <span>{isGood ? 'Good to fly' : 'Not so great to fly'}</span>
    </div>
  );
}
