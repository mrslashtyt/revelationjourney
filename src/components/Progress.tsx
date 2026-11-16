import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Award, Check, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const STORAGE_KEY = 'two-eras-progress-v1';
export const TOTAL_STEPS = 6;

export const JOURNEY_STEPS: Array<{ id: string; label: string; anchor: string }> = [
  { id: 'eras', label: 'The Two Eras', anchor: '#eras' },
  { id: 'timeline', label: 'Timeline of Revelation', anchor: '#timeline' },
  { id: 'verse', label: 'Verse of Reflection', anchor: '#verse' },
  { id: 'explorer', label: 'Explorer of the 114 Surahs', anchor: '#explorer' },
  { id: 'map', label: 'The Revelation Map', anchor: '#map' },
  { id: 'quiz', label: 'The Revelation Challenge', anchor: '#quiz' },
];

interface ProgressContextValue {
  visited: string[];
  markVisited: (id: string) => void;
}

const ProgressContext = createContext<ProgressContextValue>({ visited: [], markVisited: () => {} });

export function useProgress() {
  return useContext(ProgressContext);
}

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [visited, setVisited] = useState<string[]>(load);

  const markVisited = (id: string) => {
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
    } catch {
      // storage unavailable — progress simply is not persisted
    }
  }, [visited]);

  const value = useMemo(() => ({ visited, markVisited }), [visited]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function ProgressBadge() {
  const { visited } = useProgress();
  const [open, setOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const complete = visited.length >= TOTAL_STEPS;
  const percent = Math.round((visited.length / TOTAL_STEPS) * 100);

  useEffect(() => {
    if (complete && !celebrate) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 6000);
      return () => clearTimeout(t);
    }
  }, [complete, celebrate]);

  useEffect(() => {
    try {
      sessionStorage.setItem('two-eras-celebrated', complete ? '1' : '0');
    } catch {
      // ignore
    }
  }, [complete]);

  if (visited.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[70]">
      {celebrate && (
        <div className="absolute bottom-16 right-0 w-72 animate-fade-up rounded-2xl border border-gold-400/50 bg-night-900/95 p-5 text-center shadow-[0_0_40px_rgba(233,197,106,0.3)] backdrop-blur-md">
          <button
            onClick={() => setCelebrate(false)}
            className="absolute right-2 top-2 rounded-full p-1 text-cream/50 hover:text-cream"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <Award className="mx-auto h-8 w-8 text-gold-400" />
          <p className="mt-2 font-heading text-lg text-cream">Journey complete!</p>
          <p className="mt-1 text-xs leading-relaxed text-cream/65">
            You have explored every section of the two eras. Well done, student of revelation.
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/50 bg-night-900/90 shadow-[0_0_20px_rgba(233,197,106,0.25)] backdrop-blur-md transition-all duration-300 hover:scale-105"
        aria-label={`Journey ${percent} percent complete`}
      >
        <svg viewBox="0 0 36 36" className="absolute h-14 w-14 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(233,197,106,0.15)" strokeWidth="2.5" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="#e9c56a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${(percent / 100) * 97.4} 97.4`}
            className="transition-all duration-700"
          />
        </svg>
        <span className="relative font-heading text-sm font-semibold text-gold-300">{percent}%</span>
      </button>

      {open && (
        <div className="absolute bottom-16 right-0 w-72 animate-fade-up rounded-2xl border border-gold-500/25 bg-night-900/95 p-4 backdrop-blur-md">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Your Journey
          </p>
          {JOURNEY_STEPS.map((step) => {
            const done = visited.includes(step.id);
            return (
              <a
                key={step.id}
                href={step.anchor}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition hover:bg-gold-500/10"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    done ? 'bg-gold-400 text-night-950' : 'border border-cream/25 text-transparent'
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
                <span className={done ? 'text-cream' : 'text-cream/55'}>{step.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>,
    document.body
  );
}

export function SectionVisitWatcher({ id, children }: { id: string; children: React.ReactNode }) {
  const { markVisited, visited } = useProgress();
  const alreadyVisited = visited.includes(id);

  useEffect(() => {
    if (alreadyVisited) return;
    const el = document.getElementById(id);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markVisited(id);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, alreadyVisited, markVisited]);

  return <>{children}</>;
}
