'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, PhoneCall, LogOut } from 'lucide-react';
import LogoScentsMark from '@/components/LogoMktMark';
import ThemeToggle from '@/components/ThemeToggle';

const CLIENT_LOGIN_PATH = '/client/login';
const CLIENT_PORTAL_PATH = '/client/dashboard';

const nav = [
  { label: 'Home', href: '/' },
  { label: 'Our Suites', href: '/room-styles' },
  { label: 'Scents I Love', href: '/shop' },
  { label: 'Dining', href: '/dining' },
  { label: 'About Us', href: '/about' },
  { label: 'Things To Do', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const hasRole = (document.cookie || '')
      .split(';')
      .some((c) => c.trim().startsWith('role='));
    setAuthed(hasRole);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  const close = () => setOpen(false);

  const onLogout = () => {
    try {
      document.cookie = `role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      localStorage.removeItem('mkt_client_authed');
    } catch {}
    setAuthed(false);
    router.push('/');
  };

  return (
    <header className="w-full z-50 bg-[--brand-primary] text-white border-b border-[--brand-accent]/20 shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all duration-500 overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-black px-3 py-2 rounded"
      >
        Skip to content
      </a>

      {/* Top Row */}
      <div className="container flex items-center justify-between py-2.5 md:py-3.5">
        {/* Brand */}
        <Link
          href="/"
          onClick={close}
          aria-label="Scents & Suites — Home"
          className="flex items-center gap-2.5 select-none"
          prefetch={false}
        >
          <LogoScentsMark className="h-6 w-6 md:h-7 md:w-7 drop-glow pulse-slow" />
          <span className="text-base sm:text-lg md:text-xl font-serif font-semibold tracking-[0.3em] text-[--brand-accent] uppercase whitespace-nowrap">
            Scents & Suites
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={close}
              className={`text-white/90 hover:text-white transition font-medium ${
                isActive(item.href)
                  ? 'underline underline-offset-8 decoration-[--brand-accent]'
                  : ''
              }`}
              prefetch={false}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />
          {!authed ? (
            <>
              <Link
                href={CLIENT_LOGIN_PATH}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-sm font-medium hover:bg-[--brand-accent]/10 transition"
                style={{
                  borderColor: 'var(--brand-accent)',
                  color: 'var(--brand-accent)',
                }}
                prefetch={false}
              >
                Log In
              </Link>
              <Link
                href="/booking"
                className="btn-accent text-sm font-semibold px-3 py-1.5"
                prefetch={false}
              >
                Book a Stay
              </Link>
            </>
          ) : (
            <>
              <Link
                href={CLIENT_PORTAL_PATH}
                className="btn-navy text-sm font-semibold px-3 py-1.5"
                prefetch={false}
              >
                My Portal
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-white/90 hover:text-white text-sm"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden p-2 text-white"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height] duration-400 ${
          open ? 'max-h-[80vh]' : 'max-h-0'
        }`}
        aria-hidden={!open}
      >
        <div className="px-4 pb-4 pt-2 bg-[--brand-primary] border-t border-white/10">
          <div className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={close}
                className="text-white text-base"
                prefetch={false}
              >
                {item.label}
              </Link>
            ))}

            <div className="h-px bg-white/10 my-1" />
            <ThemeToggle />

            {!authed ? (
              <>
                <Link
                  href={CLIENT_LOGIN_PATH}
                  onClick={close}
                  className="btn-navy w-full text-center"
                  prefetch={false}
                >
                  Log In
                </Link>
                <Link
                  href="/booking"
                  onClick={close}
                  className="btn-accent w-full text-center"
                  prefetch={false}
                >
                  Book a Stay
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={CLIENT_PORTAL_PATH}
                  onClick={close}
                  className="btn-navy w-full text-center"
                  prefetch={false}
                >
                  My Portal
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full text-center inline-flex items-center justify-center gap-2 px-4 py-2 rounded text-white/90 hover:text-white"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}

            <a
              href="tel:+26771680243"
              className="inline-flex items-center gap-2 text-white/90 mt-2"
            >
              <PhoneCall size={18} /> +267 716 80243 / 722 02747
            </a>
          </div>
        </div>
      </div>

      {/* Logo Pulse */}
      <style jsx global>{`
        @keyframes pulseSoft {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 5px rgba(184, 155, 89, 0.45));
          }
          50% {
            transform: scale(1.03);
            filter: drop-shadow(0 0 10px rgba(214, 182, 120, 0.8));
          }
        }
        .pulse-slow {
          animation: pulseSoft 5s ease-in-out infinite;
          transform-origin: center;
        }
        .drop-glow {
          filter: drop-shadow(0 0 6px rgba(184, 155, 89, 0.45));
          transition: filter 0.3s ease;
        }
        .drop-glow:hover {
          filter: drop-shadow(0 0 10px rgba(214, 182, 120, 0.7));
        }
      `}</style>
    </header>
  );
}
