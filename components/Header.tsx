import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { cn } from '@/lib/cn';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/kissner-field', label: 'Kissner Field' },
  { href: '/events', label: 'Events' },
  { href: '/media', label: 'Media' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function isActive(pathname: string, href: string) {
  const currentPath = pathname.replace(/\/$/, '') || '/';
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-green text-white shadow-[var(--shadow-card)]">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-6 px-5 py-4 max-md:px-4 max-md:py-3.5">
        <Link href="/" className="flex items-center gap-4 text-white no-underline hover:text-white">
          <img
            src="/images/logo.jpg"
            alt="Baton Rouge RC Club logo"
            width={120}
            height={56}
            className="w-[120px] rounded-md bg-white p-1.5 max-md:w-[90px]"
          />
          <span className="max-w-56 font-heading text-[1.15rem] font-bold leading-snug max-md:max-w-40 max-md:text-base">
            Baton Rouge Radio Control Club
          </span>
        </Link>
        <nav className="flex w-full flex-col items-start md:w-auto md:flex-row md:items-center" aria-label="Main">
          <button
            type="button"
            className="min-h-11 cursor-pointer rounded-md border border-white/40 px-3 py-2 text-sm font-semibold text-white md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
          >
            Menu
          </button>
          <ul
            id="main-nav"
            className={cn(
              'm-0 w-full list-none flex-col gap-1 p-0 md:flex md:w-auto md:flex-row md:flex-wrap md:justify-end md:gap-1.5',
              menuOpen ? 'flex pt-3' : 'hidden md:flex',
            )}
          >
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(router.pathname, href) ? 'page' : undefined}
                  className={cn(
                    'block rounded-md px-3.5 py-2 text-sm font-semibold no-underline transition-colors',
                    isActive(router.pathname, href)
                      ? 'bg-rust text-white hover:bg-rust-dark hover:text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white',
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
