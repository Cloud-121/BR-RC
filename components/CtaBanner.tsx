import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CtaBannerProps {
  children: ReactNode;
  className?: string;
}

export default function CtaBanner({ children, className }: CtaBannerProps) {
  return (
    <div
      className={cn(
        'mt-10 rounded-[var(--radius-default)] bg-green px-8 py-6 text-center text-white max-md:px-4 max-md:py-5',
        className,
      )}
    >
      <p className="m-0 text-[1.05rem]">{children}</p>
    </div>
  );
}
