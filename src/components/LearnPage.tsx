import { useState } from 'react';
import { BookOpen, Lightbulb, ScrollText, Sparkles, Star } from 'lucide-react';
import { VERSES } from '../data/verses';
import { DID_YOU_KNOW } from '../data/quiz';
import { SURAHS } from '../data/surahs';
import { OrnamentDivider } from './Decor';
import { useNav } from './NavContext';

const CATEGORIES = [
  {
    icon: BookOpen,
    title: 'Understanding the Two Eras',
    desc: 'The Quran was revealed over 23 years in two distinct periods. Makkan surahs (610–622 CE) are shorter, rhythmic, and focus on faith, the Hereafter, and pure monotheism. Madinan surahs (622–632 CE) are longer and build community law, worship, and social justice.',
  },
  {
    icon: ScrollText,
    title: 'How to Identify a Surah-s Origin',
    desc: 'Makkan surahs often begin with oaths (By the sun, by the night), address "O mankind", and feature short, striking verses. Madinan surahs address "O you who believe", discuss laws of marriage, inheritance, and war, and often mention the hypocrites.',
  },
  {
    icon: Lightbulb,
    title: 'Why Chronological Order Matters',
    desc: 'The Quran is arranged by compilation, not by time of revelation. Understanding the chronological order helps you see how guidance evolved — from personal faith in Makkah to the blueprint of a civilisation in Madinah.',
  },
];

export function LearnPage() {
  const { navigate } = useNav();
  const [verseIdx, setVerseIdx] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const verse = VERSES[verseIdx];
  const surah = SURAHS.find((s) => s.number === verse.surahNumber);
  const makkan = verse.era === 'Makkan';

  const famousSurahs = SURAHS.filter((s) =>
    ['Al-Fatihah', 'Al-Baqarah', 'Yusuf', 'Maryam', 'Al-Kahf', 'Ya-Sin', 'Ar-Rahman', 'Al-Mulk', 'An-Nas', 'Al-Ikhlas'].includes(s.nameEn)
  );

  return (
    <div className="min-h-screen bg-ivory-50 animate-fade-in">
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-20">
        <div className="text-center">
          <p className="font-arabic text-lg text-sage-500">موارد تعليمية</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 md:text-5xl">Learning Resources</h1>
          <OrnamentDivider className="mt-5" />
          <p className="mx-auto mt-5 max-w-2xl text-charcoal-500">
            Deepen your understanding of the Makkan and Madinan revelation through curated reflections, key facts, and study guides.
          </p>
        </div>

        {/* Educational categories */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-surface-elevated rounded-2xl p-7 transition-all duration-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sage-100">
                <Icon className="h-5 w-5 text-sage-600" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold text-charcoal-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* Verse of Reflection */}
        <div className="mt-16">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100">
              <Sparkles className="h-6 w-6 text-sage-600" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-charcoal-900">Verse of Reflection</h2>
          </div>

          <div className="card-surface-elevated rounded-2xl p-8 text-center md:p-12">
            <p className="font-arabic text-3xl leading-[2] text-sage-600 md:text-4xl md:leading-[2]" dir="rtl">
              {verse.arabic}
            </p>
            <p className="mx-auto mt-8 max-w-xl font-serif text-xl italic leading-relaxed text-charcoal-800 md:text-2xl">
              "{verse.translation}"
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.15em] text-charcoal-400">{verse.reference}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              <span
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                  makkan ? 'bg-sage-50 text-sage-700' : 'bg-sand-50 text-sand-600'
                }`}
              >
                {verse.era}
              </span>
              {surah && (
                <span className="rounded-full border border-charcoal-200 px-4 py-1.5 text-xs text-charcoal-500">
                  Surah {surah.nameEn} · Chapter {surah.number} · revealed #{surah.chronologicalOrder}
                </span>
              )}
            </div>

            <div className="mx-auto mt-8 max-w-2xl border-t border-charcoal-200/50 pt-8">
              <p className="text-sm leading-relaxed text-charcoal-600 md:text-base">{verse.reflection}</p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setVerseIdx((i) => (i - 1 + VERSES.length) % VERSES.length)}
                className="rounded-lg border border-charcoal-200 px-5 py-2.5 text-sm font-medium text-charcoal-600 transition hover:bg-ivory-100"
              >
                Previous
              </button>
              <button
                onClick={() => setVerseIdx((i) => (i + 1) % VERSES.length)}
                className="rounded-lg bg-sage-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sage-700"
              >
                Next Verse
              </button>
            </div>
          </div>
        </div>

        {/* Did You Know facts */}
        <div className="mt-16">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sand-100">
              <Star className="h-6 w-6 text-sand-500" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-charcoal-900">Did You Know?</h2>
          </div>

          <div className="card-surface-elevated rounded-2xl p-8 text-center md:p-10">
            <p className="mx-auto max-w-2xl min-h-[4rem] font-serif text-xl leading-relaxed text-charcoal-800 transition-opacity duration-500 md:text-2xl">
              {DID_YOU_KNOW[factIdx]}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {DID_YOU_KNOW.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFactIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === factIdx ? 'w-8 bg-sand-400' : 'w-1.5 bg-charcoal-200 hover:bg-charcoal-300'
                  }`}
                  aria-label={`Fact ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Featured Surahs to study */}
        <div className="mt-16">
          <h2 className="mb-6 text-center font-serif text-2xl font-semibold text-charcoal-900">Surahs to Study</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {famousSurahs.map((s) => (
              <button
                key={s.number}
                onClick={() => navigate('explorer')}
                className="card-surface rounded-xl p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg font-serif text-sm font-semibold ${
                  s.era === 'Makkan' ? 'bg-sage-100 text-sage-700' : 'bg-sand-100 text-sand-600'
                }`}>
                  {s.number}
                </span>
                <span className="mt-3 block font-serif text-lg font-semibold text-charcoal-900">{s.nameEn}</span>
                <span className="block font-arabic text-2xl text-charcoal-600">{s.nameAr}</span>
                <span className="mt-1 block text-xs text-charcoal-400">{s.verses} verses · {s.era}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
