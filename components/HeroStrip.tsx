import Link from 'next/link';
import { cn } from '@/lib/cn';

interface HeroStripProps {
  headline?: string;
  subtitle?: string;
  showButton?: boolean;
  buttonHref?: string;
  buttonText?: string;
  compact?: boolean;
  imageSrc?: string;
  imagePositionClass?: string;
}

export default function HeroStrip({
  headline = 'Come Fly With Us',
  subtitle,
  showButton = true,
  buttonHref = '/about',
  buttonText = 'Learn About the Club',
  compact = false,
  imageSrc,
  imagePositionClass,
}: HeroStripProps) {
  return (
    <section
      className={cn('hero-bg', compact && 'hero-bg--compact', imagePositionClass)}
      style={imageSrc ? { backgroundImage: `url('${imageSrc}')` } : undefined}
    >
      <div
        className={cn(
          'relative mx-auto w-full max-w-content px-5',
          compact ? 'py-10 max-md:px-4' : 'py-14 max-md:px-4 max-md:py-10',
        )}
      >
        <h1
          className={cn(
            'mb-3 text-white',
            compact
              ? 'max-w-none text-[clamp(1.75rem,4vw,2.25rem)]'
              : 'max-w-[16ch] max-md:max-w-[20ch]',
          )}
        >
          {headline}
        </h1>
        {subtitle && (
          <p className="mb-6 max-w-xl text-[1.05rem] text-white/90 max-md:text-base">{subtitle}</p>
        )}
        {showButton && (
          <Link
            href={buttonHref}
            className="inline-block rounded-md border-2 border-white bg-transparent px-5 py-2.5 text-[0.95rem] font-semibold text-white no-underline transition-colors hover:bg-white hover:text-green"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
