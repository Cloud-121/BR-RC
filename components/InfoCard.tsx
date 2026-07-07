import Link from 'next/link';
import type { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  href: string;
  children: ReactNode;
}

export default function InfoCard({ title, href, children }: InfoCardProps) {
  return (
    <article className="flex flex-col rounded-[var(--radius-default)] border border-border bg-white p-6 shadow-[var(--shadow-card)] border-t-[3px] border-t-green-light">
      <h3 className="mb-2.5">{title}</h3>
      <p className="mb-5 flex-1 text-[0.92rem] text-text-muted">{children}</p>
      <Link
        href={href}
        className="inline-block self-start rounded-md bg-rust px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-rust-dark hover:text-white"
      >
        More info
      </Link>
    </article>
  );
}
