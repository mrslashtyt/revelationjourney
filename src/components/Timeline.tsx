import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SURAHS } from '../data/surahs';
import { OrnamentDivider } from './Decor';

const KEY_EVENTS: Record<number, string> = {
  1: 'The first revelation — "Read!" in the cave of Hira.',
  2: 'The mission begins: "Arise and warn."',
  24: 'Revelation pauses; Surah Ad-Duha brings consolation.',
  26: 'The migration to Abyssinia — Surah Maryam carried there.',
  45: 'Umar ibn al-Khattab embraces Islam after hearing Ta-Ha.',
  53: 'The Year of Sorrow — Surah Yusuf brings comfort.',
  87: 'The Hijrah: the community of Madinah is born.',
  89: 'The first Battle — Badr — and lessons of victory.',
  90: 'The siege of Madinah and the Battle of the Trench.',
  111: 'The peaceful conquest of Makkah — Surah Al-Fath.',
  113: 'Among the final verses, revealed at the Farewell Pilgrimage.',
  114: 'The revelation is complete — 23 years of the Quran.',
};

function TimelineCard({ index }: { index: number }) {
  const surah = SURAHS.find((s) => s.chronologicalOrder === index);
  if (!surah) return null;
  const event = KEY_EVENTS[surah.chronologicalOrder];
  const makkan = surah.era === 'Makkan';

  return (
    <div
      className={`w-[280px] shrink-0 snap-center rounded-xl card-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md ${
        makkan ? 'hover:border-sage-300' : 'hover:border-sand-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-arabic text-2xl ${makkan ? 'text-sage-500' : 'text-sand-500'}`}>{surah.nameAr}</span>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
            makkan ? 'bg-sage-50 text-sage-700' : 'bg-sand-50 text-sand-600'
          }`}
        >
          {surah.era}
        </span>
      </div>
      <h4 className="mt-3 font-serif text-xl font-semibold text-charcoal-900">
        {surah.nameEn}
        <span className="ml-2 text-sm font-normal text-charcoal-400">#{surah.chronologicalOrder} revealed</span>
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
        {event ?? surah.summary.split('.')[0] + '.'}
      </p>
      <p className="mt-4 text-xs uppercase tracking-[0.15em] text-charcoal-400">
        Chapter {surah.number} · {surah.verses} verses
      </p>
    </div>
  );
}

export function Timeline() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const total = useMemo(() => SURAHS.length, []);

  const scrollTo = (order: number) => {
    const clamped = Math.max(1, Math.min(total, order));
    setActiveIndex(clamped);
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>(`[data-order="${clamped}"]`);
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const onScrollerScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    const cards = scroller.querySelectorAll<HTMLElement>('[data-order]');
    let closest = 1;
    let minDist = Infinity;
    cards.forEach((c) => {
      const order = Number(c.dataset.order);
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (dist < minDist) {
        minDist = dist;
        closest = order;
      }
    });
    setActiveIndex(closest);
  };

  const progress = ((activeIndex - 1) / (total - 1)) * 100;

  return (
    <div className="min-h-screen bg-ivory-50 animate-fade-in">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
        <div className="text-center">
          <p className="font-arabic text-lg text-sage-500">التسلسل الزمني للوحي</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 md:text-5xl">The Timeline of Revelation</h1>
          <OrnamentDivider className="mt-5" />
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-charcoal-500">
            The Quran was not revealed in its current order. Slide through the 23 years of revelation in chronological order and watch the story unfold — from a single word, "Read", to a completed way of life.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.15em] text-charcoal-400">
            <span>Makkah · 13 years</span>
            <span className="font-serif text-base normal-case tracking-normal text-sage-700">
              Revelation #{activeIndex}
            </span>
            <span>Madinah · 10 years</span>
          </div>
          <div className="relative mt-3 h-2.5 rounded-full bg-ivory-200">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sage-500 to-sand-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            <span
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sage-500 bg-white shadow-sm transition-all duration-300"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-charcoal-400">
            <span>610 CE</span>
            <span>632 CE</span>
          </div>
        </div>

        <div
          ref={scrollerRef}
          onScroll={onScrollerScroll}
          className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50%-140px)] pb-4"
        >
          {Array.from({ length: total }, (_, i) => (
            <div key={i + 1} data-order={i + 1} className="snap-center">
              <TimelineCard index={i + 1} />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => scrollTo(activeIndex - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-300 text-sage-600 transition hover:bg-sage-50 disabled:opacity-30"
            disabled={activeIndex <= 1}
            aria-label="Previous revelation"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <input
            type="range"
            min={1}
            max={total}
            value={activeIndex}
            onChange={(e) => scrollTo(Number(e.target.value))}
            className="h-1.5 w-56 cursor-pointer appearance-none rounded-full bg-ivory-200 accent-sage-500 md:w-80"
            aria-label="Timeline position"
          />
          <button
            onClick={() => scrollTo(activeIndex + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-300 text-sage-600 transition hover:bg-sage-50 disabled:opacity-30"
            disabled={activeIndex >= total}
            aria-label="Next revelation"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
