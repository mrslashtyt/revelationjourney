import { useState } from 'react';
import { BookOpen, Compass, Home, Map as MapIcon, MessageCircle, Moon, ScrollText, Sparkles, Timer, TrendingUp, X, Zap } from 'lucide-react';
import { useNav, type PageId } from './NavContext';
import { MatchGame } from './MatchGame';

const NAV_ITEMS: Array<{ id: PageId; label: string; icon: typeof Home }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explorer', label: 'Surah Explorer', icon: Compass },
  { id: 'eras', label: 'Makkan vs Madinan', icon: BookOpen },
  { id: 'timeline', label: 'Timeline', icon: Timer },
  { id: 'map', label: 'Interactive Map', icon: MapIcon },
  { id: 'quiz', label: 'Quiz & Games', icon: Sparkles },
  { id: 'learn', label: 'Learn', icon: ScrollText },
  { id: 'askai', label: 'Ask AI', icon: MessageCircle },
  { id: 'progress', label: 'My Learning', icon: TrendingUp },
];

export function Navbar() {
  const { page, navigate } = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);

  const go = (id: PageId) => {
    navigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-charcoal-200/50 bg-ivory-50/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
          <button onClick={() => go('home')} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-500 text-ivory-50">
              <Moon className="h-5 w-5" />
            </span>
            <span className="font-serif text-lg font-semibold text-charcoal-900">
              Two Eras <span className="font-arabic text-sage-600">الوحي</span>
            </span>
          </button>

          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  page === id
                    ? 'bg-sage-100 text-sage-700'
                    : 'text-charcoal-500 hover:bg-ivory-200 hover:text-charcoal-800'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setGameOpen(true)}
              className="ml-1 flex items-center gap-1.5 rounded-lg bg-sand-400 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-sand-500"
            >
              <Zap className="h-3.5 w-3.5" /> Match Game
            </button>
          </div>

          <button
            className="rounded-lg p-2 text-charcoal-600 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </nav>

        {mobileOpen && (
          <div className="border-t border-charcoal-200/40 bg-ivory-50 px-5 py-3 lg:hidden">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  page === id ? 'bg-sage-100 text-sage-700' : 'text-charcoal-600 hover:bg-ivory-200'
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
            <button
              onClick={() => { setMobileOpen(false); setGameOpen(true); }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-sand-600"
            >
              <Zap className="h-4 w-4" /> Match Game
            </button>
          </div>
        )}
      </header>

      {gameOpen && <MatchGame onClose={() => setGameOpen(false)} />}
    </>
  );
}
