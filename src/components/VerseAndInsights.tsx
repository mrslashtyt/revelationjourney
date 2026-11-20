import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { VERSES } from '../data/verses';
import { SURAHS } from '../data/surahs';
import { OrnamentDivider } from './Decor';

export function VerseReflectionSection() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * VERSES.length));

  useEffect(() => {
    setIndex(Math.floor(Math.random() * VERSES.length));
  }, []);

  const verse = VERSES[index];
  const surah = SURAHS.find((s) => s.number === verse.surahNumber);
  const makkan = verse.era === 'Makkan';

  return (
    <section id="verse" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 geometric-pattern opacity-30" />
      <div className="relative mx-auto max-w-4xl px-5">
        <div className="text-center">
          <p className="font-arabic text-xl text-gold-400">آية التدبر</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-cream md:text-5xl">
            Verse of Reflection
          </h2>
          <OrnamentDivider className="mt-6" />
        </div>

        <div className="card-surface mt-12 rounded-3xl px-6 py-12 text-center md:px-14">
          <p className="font-arabic text-3xl leading-[2] text-gold-200 md:text-4xl md:leading-[2]" dir="rtl">
            {verse.arabic}
          </p>
          <p className="mx-auto mt-8 max-w-xl font-heading text-xl italic leading-relaxed text-cream md:text-2xl">
            "{verse.translation}"
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-cream/50">{verse.reference}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                makkan ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gold-500/15 text-gold-300'
              }`}
            >
              {verse.era}
            </span>
            {surah && (
              <span className="rounded-full border border-cream/15 px-4 py-1.5 text-xs text-cream/70">
                Surah {surah.nameEn} · Chapter {surah.number} · revealed #{surah.chronologicalOrder}
              </span>
            )}
          </div>

          <div className="mx-auto mt-8 max-w-2xl border-t border-gold-500/15 pt-8">
            <p className="text-sm leading-relaxed text-cream/70 md:text-base">{verse.reflection}</p>
          </div>

          <button
            onClick={() => setIndex((i) => (i + 1) % VERSES.length)}
            className="mt-8 rounded-full border border-gold-500/40 px-8 py-3 text-sm font-medium text-gold-300 transition hover:bg-gold-500/10"
          >
            Another Verse
          </button>
        </div>
      </div>
    </section>
  );
}

interface BarProps {
  label: string;
  value: number;
  maxValue: number;
  display: string;
  color: string;
  delay: number;
}

function InsightBar({ label, value, maxValue, display, color, delay }: BarProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-cream/80">{label}</span>
        <span className="font-heading text-lg text-gold-300">{display}</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-night-800">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: inView ? `${(value / maxValue) * 100}%` : '0%', transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

export function Insights() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const makkan = SURAHS.filter((s) => s.era === 'Makkan');
  const madinan = SURAHS.filter((s) => s.era === 'Madinan');
  const makkanVerses = makkan.reduce((a, s) => a + s.verses, 0);
  const madinanVerses = madinan.reduce((a, s) => a + s.verses, 0);
  const makkanAvg = Math.round(makkanVerses / makkan.length);
  const madinanAvg = Math.round(madinanVerses / madinan.length);
  const longest = SURAHS.reduce((a, s) => (s.verses > a.verses ? s : a), SURAHS[0]);
  const shortest = SURAHS.reduce((a, s) => (s.verses < a.verses ? s : a), SURAHS[0]);
  const maxVerses = Math.max(makkanVerses, madinanVerses);

  return (
    <section className="relative py-24">
      <div ref={ref} className="mx-auto max-w-4xl px-5">
        <div className="text-center">
          <p className="font-arabic text-xl text-gold-400">إحصاءات</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-cream md:text-5xl">
            The Two Eras in Numbers
          </h2>
          <OrnamentDivider className="mt-6" />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-cream/70">
            {makkan.length} Makkan surahs, yet only {makkanVerses.toLocaleString()} verses — while the{' '}
            {madinan.length} Madinan surahs carry {madinanVerses.toLocaleString()}. The message of
            faith came in short, burning passages; the laws of society in long, detailed chapters.
          </p>
        </div>

        <div className={`card-surface mt-12 space-y-8 rounded-3xl p-8 md:p-12 ${inView ? '' : 'opacity-60'}`}>
          <InsightBar
            label="Verses revealed in Makkah"
            value={makkanVerses}
            maxValue={maxVerses}
            display={makkanVerses.toLocaleString()}
            color="bg-gradient-to-r from-emerald-600 to-emerald-400"
            delay={0}
          />
          <InsightBar
            label="Verses revealed in Madinah"
            value={madinanVerses}
            maxValue={maxVerses}
            display={madinanVerses.toLocaleString()}
            color="bg-gradient-to-r from-gold-600 to-gold-400"
            delay={200}
          />
          <div className="border-t border-gold-500/15 pt-8">
            <InsightBar
              label="Average Makkan surah length"
              value={makkanAvg}
              maxValue={Math.max(makkanAvg, madinanAvg)}
              display={`≈ ${makkanAvg} verses`}
              color="bg-gradient-to-r from-emerald-600 to-emerald-400"
              delay={350}
            />
            <div className="mt-8">
              <InsightBar
                label="Average Madinan surah length"
                value={madinanAvg}
                maxValue={Math.max(makkanAvg, madinanAvg)}
                display={`≈ ${madinanAvg} verses`}
                color="bg-gradient-to-r from-gold-600 to-gold-400"
                delay={500}
              />
            </div>
          </div>
          <div className="grid gap-4 border-t border-gold-500/15 pt-8 text-center sm:grid-cols-2">
            <div className="rounded-2xl bg-night-800/60 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Longest surah</p>
              <p className="mt-2 font-heading text-2xl text-cream">
                {longest.nameEn} <span className="font-arabic text-gold-300">{longest.nameAr}</span>
              </p>
              <p className="mt-1 text-sm text-cream/60">{longest.verses} verses · {longest.era}</p>
            </div>
            <div className="rounded-2xl bg-night-800/60 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Shortest surah</p>
              <p className="mt-2 font-heading text-2xl text-cream">
                {shortest.nameEn} <span className="font-arabic text-gold-300">{shortest.nameAr}</span>
              </p>
              <p className="mt-1 text-sm text-cream/60">{shortest.verses} verses · {shortest.era}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
