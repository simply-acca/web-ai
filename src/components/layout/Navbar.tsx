'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/features',  label: 'Features' },
  { href: '/pricing',   label: 'Pricing' },
  { href: '/resources', label: 'Resources' },
  { href: '/about',     label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'relative transition-colors duration-200',
                active
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-700 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400',
              ].join(' ')}
            >
              {link.label}
              <span
                className={[
                  'absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-emerald-500 transition-opacity duration-200',
                  active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                ].join(' ')}
              />
            </Link>
          );
        })}
      </nav>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-zinc-700 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="ml-auto flex h-full w-72 flex-col bg-white dark:bg-zinc-900 p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold text-zinc-900 dark:text-white">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-zinc-600 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-3 text-base font-medium">
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={[
                      'rounded-lg px-3 py-2 transition-colors',
                      active
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}