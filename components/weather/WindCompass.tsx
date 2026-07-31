import { cn } from '@/lib/cn';

interface WindCompassProps {
  directionDeg: number;
  directionLabel: string;
  className?: string;
}

export default function WindCompass({
  directionDeg,
  directionLabel,
  className,
}: WindCompassProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative h-28 w-28">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full text-text-muted"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">
            N
          </text>
          <text x="88" y="54" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">
            E
          </text>
          <text x="50" y="94" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">
            S
          </text>
          <text x="12" y="54" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">
            W
          </text>
          <g transform={`rotate(${directionDeg} 50 50)`}>
            <line x1="50" y1="50" x2="50" y2="18" stroke="currentColor" strokeWidth="2" />
            <polygon points="50,12 44,24 56,24" fill="currentColor" />
          </g>
          <circle cx="50" cy="50" r="4" fill="currentColor" />
        </svg>
      </div>
      <p className="m-0 text-sm font-semibold text-green">{directionLabel}</p>
    </div>
  );
}
