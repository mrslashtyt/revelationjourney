import { useEffect, useState } from 'react';
import { BookOpen, Map, ScrollText, Timer, Trophy } from 'lucide-react';

const LINKS = [
  { href: '#eras', label: 'The Two Eras', icon: BookOpen },
  { href: '#timeline', label: 'Timeline', icon: Timer },
  { href: '#explorer', label: 'Explore Surahs', icon: ScrollText },
  { href: '#map', label: 'Revelation Map', icon: Map },
  { href: '#quiz', label: 'Quiz', icon: Trophy },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'bg-night-950/90 shadow-[0_1px_0_rgba(233,197,106,0.15)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-gold-400" fill="currentColor" aria-hidden>
            <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
          </svg>
          <span className="font-heading text-lg font-semibold tracking-wide text-cream">
            The Two Eras <span className="font-arabic text-gold-400">الزهران</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm text-cream/80 transition-all duration-300 hover:bg-gold-500/10 hover:text-gold-300"
            >
              {label}
            </a>
          ))}
          <a
            href="#quiz"
            className="ml-2 rounded-full border border-gold-500/50 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-300 transition-all duration-300 hover:bg-gold-500/25 hover:shadow-[0_0_18px_rgba(233,197,106,0.35)]"
          >
            Take the Quiz
          </a>
        </div>

        <button
          className="rounded-lg p-2 text-gold-300 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold-500/15 bg-night-950/95 px-5 py-3 backdrop-blur-md md:hidden">
          {LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-cream/85 transition hover:bg-gold-500/10 hover:text-gold-300"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
