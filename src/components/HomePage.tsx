import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Compass, Map as MapIcon, Sparkles, Star, Timer, TrendingUp } from 'lucide-react';
import { useNav } from './NavContext';
import { SURAHS } from '../data/surahs';
import { OrnamentDivider } from './Decor';
import { useInView, useCountUp } from '../hooks/useInView';

function CountStat({ target, label, suffix }: { target: number; label: string; suffix?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const value = useCountUp(target, inView);
  return (
    <span ref={ref} className="font-serif text-3xl font-semibold text-charcoal-900 md:text-4xl">
      {value.toLocaleString()}{suffix}
      <span className="mt-1 block font-body text-xs font-normal uppercase tracking-[0.15em] text-charcoal-400">
        {label}
      </span>
    </span>
  );
}

const FEATURE_CARDS = [
  { icon: Compass, title: 'Surah Explorer', desc: 'Search, filter, and browse all 114 surahs', page: 'explorer' as const, accent: 'sage' },
  { icon: BookOpen, title: 'Makkan vs Madinan', desc: 'Compare the two great periods of revelation', page: 'eras' as const, accent: 'sand' },
  { icon: Timer, title: 'Timeline', desc: '23 years of revelation in chronological order', page: 'timeline' as const, accent: 'olive' },
  { icon: MapIcon, title: 'Interactive Map', desc: 'Trace revelation across Makkah and Madinah', page: 'map' as const, accent: 'bronze' },
  { icon: Sparkles, title: 'Quiz & Games', desc: 'Test your knowledge and match the surahs', page: 'quiz' as const, accent: 'sage' },
];

const accentMap: Record<string, string> = {
  sage: 'bg-sage-100 text-sage-700 group-hover:bg-sage-500 group-hover:text-white',
  sand: 'bg-sand-100 text-sand-600 group-hover:bg-sand-400 group-hover:text-white',
  olive: 'bg-olive-100 text-olive-600 group-hover:bg-olive-500 group-hover:text-white',
  bronze: 'bg-bronze-300/30 text-bronze-500 group-hover:bg-bronze-400 group-hover:text-white',
};

const TIMELINE_PREVIEW = [
  { order: 1, label: 'First revelation in Hira', year: '610 CE' },
  { order: 53, label: 'Year of Sorrow — Surah Yusuf', year: '619 CE' },
  { order: 87, label: 'The Hijrah to Madinah', year: '622 CE' },
  { order: 111, label: 'Conquest of Makkah', year: '630 CE' },
  { order: 114, label: 'Revelation complete', year: '632 CE' },
];

function getDailySurah() {
  const day = Math.floor(Date.now() / 86400000);
  return SURAHS[day % SURAHS.length];
}

export function HomePage() {
  const { navigate } = useNav();
  const daily = getDailySurah();
  const { ref: timelineRef, inView: timelineInView } = useInView<HTMLDivElement>();

  const [factIdx, setFactIdx] = useState(0);
  const facts = [
    'The Quran was revealed over approximately 23 years — 13 in Makkah and 10 in Madinah.',
    'Surah Al-Alaq contains the very first verses: "Read, in the name of your Lord who created."',
    'Makkan surahs tend to be shorter and focus on faith; Madinan surahs are longer and build laws.',
    'Surah At-Tawbah is the only surah that does not begin with the Basmalah.',
    'About 86 of the 114 surahs were revealed in Makkah, yet Madinan surahs contain most verses.',
  ];
  useEffect(() => {
    const t = setInterval(() => setFactIdx((i) => (i + 1) % facts.length), 5000);
    return () => clearInterval(t);
  }, [facts.length]);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ivory-100 via-ivory-50 to-white" />
        <div className="absolute inset-0 pattern-subtle" />
        <div className="relative mx-auto max-w-5xl px-5 pt-20 pb-28 text-center md:pt-32 md:pb-36">
          <p className="animate-fade-up font-arabic text-2xl text-sage-600 md:text-3xl" style={{ animationDelay: '0.1s' }}>
            وَقُرْآنًا فَرَقْنَاهُ لِتَقْرَأَهُ عَلَى النَّاسِ
          </p>
          <p className="mt-2 animate-fade-up text-sm italic text-charcoal-500" style={{ animationDelay: '0.2s' }}>
            "And it is a Quran which We have divided, that you may recite it to the people." — Al-Isra 17:106
          </p>

          <h1 className="mt-10 animate-fade-up font-serif text-5xl font-semibold leading-[1.1] text-charcoal-900 md:text-7xl" style={{ animationDelay: '0.35s' }}>
            The Two Eras of
            <span className="mt-2 block text-sage-600">Revelation</span>
          </h1>

          <OrnamentDivider className="mt-8 animate-fade-up" />

          <p className="mx-auto mt-8 max-w-2xl animate-fade-up text-base leading-relaxed text-charcoal-600 md:text-lg" style={{ animationDelay: '0.5s' }}>
            Journey through twenty-three years of divine revelation — from the cave of Hira in Makkah
            to the community of Madinah — and discover how the place and moment of each surah shaped its message.
          </p>

          <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '0.65s' }}>
            <button
              onClick={() => navigate('eras')}
              className="flex items-center gap-2 rounded-lg bg-sage-600 px-7 py-3.5 font-medium text-white transition hover:bg-sage-700 hover:shadow-lg"
            >
              Begin the Journey <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('quiz')}
              className="rounded-lg border border-sage-300 px-7 py-3.5 font-medium text-sage-700 transition hover:bg-sage-50"
            >
              Test Your Knowledge
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-10 md:gap-16">
            <CountStat target={114} label="Total Surahs" />
            <CountStat target={86} label="Makkan" />
            <CountStat target={28} label="Madinan" />
            <CountStat target={23} label="Years" suffix=" yr" />
          </div>
        </div>
      </section>

      {/* Feature preview cards */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 text-center">
            <p className="font-arabic text-lg text-sage-500">استكشف</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-charcoal-900 md:text-4xl">Explore the Revelation</h2>
            <p className="mx-auto mt-4 max-w-xl text-charcoal-500">Five interactive tools to deepen your understanding of the Quran's two eras.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-5">
            {FEATURE_CARDS.map(({ icon: Icon, title, desc, page, accent }) => (
              <button
                key={title}
                onClick={() => navigate(page)}
                className="group card-surface rounded-xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-300 ${accentMap[accent]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal-900">{title}</h3>
                <p className="mt-1.5 text-sm text-charcoal-500">{desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sage-600 opacity-0 transition group-hover:opacity-100">
                  Open <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Surah + Did You Know */}
      <section className="bg-ivory-100 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2">
          {/* Daily Surah */}
          <div className="card-surface-elevated rounded-2xl overflow-hidden">
            <div className="bg-sage-600 px-6 py-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Featured Today</p>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal-400">Surah {daily.number} · {daily.era}</p>
                  <h3 className="mt-1 font-serif text-2xl font-semibold text-charcoal-900">{daily.nameEn}</h3>
                  <p className="text-sm italic text-charcoal-500">"{daily.meaning}"</p>
                </div>
                <p className="font-arabic text-4xl text-sage-500">{daily.nameAr}</p>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-charcoal-600">{daily.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {daily.themes.map((t) => (
                  <span key={t} className="rounded-full bg-sage-50 px-3 py-1 text-xs text-sage-700">{t}</span>
                ))}
              </div>
              <button
                onClick={() => navigate('explorer')}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-sage-600 hover:text-sage-700"
              >
                Explore all 114 surahs <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Did You Know */}
          <div className="card-surface-elevated rounded-2xl overflow-hidden">
            <div className="bg-sand-400 px-6 py-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Did You Know?</p>
            </div>
            <div className="flex flex-col p-8">
              <Star className="h-6 w-6 text-sand-400" />
              <p className="mt-4 min-h-[4rem] font-serif text-lg leading-relaxed text-charcoal-800 transition-opacity duration-500">
                {facts[factIdx]}
              </p>
              <div className="mt-auto flex gap-1.5 pt-6">
                {facts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFactIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${i === factIdx ? 'w-6 bg-sand-400' : 'w-1.5 bg-charcoal-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline preview */}
      <section className="bg-white py-20">
        <div ref={timelineRef} className="mx-auto max-w-4xl px-5">
          <div className="mb-10 text-center">
            <p className="font-arabic text-lg text-sage-500">التسلسل الزمني</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-charcoal-900 md:text-4xl">A Glimpse of the Timeline</h2>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-sage-300 via-sand-300 to-sage-300 md:left-1/2 md:-translate-x-1/2" />
            <div className="space-y-8">
              {TIMELINE_PREVIEW.map((event, i) => (
                <div
                  key={event.order}
                  className={`relative flex items-center gap-6 transition-all duration-700 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } ${timelineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="absolute left-4 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full border-2 border-sage-500 bg-white md:left-1/2" />
                  <div className="ml-10 md:ml-0 md:flex-1">
                    <div className="card-surface rounded-xl px-5 py-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-sand-500">{event.year}</p>
                      <p className="mt-1 text-sm font-medium text-charcoal-800">{event.label}</p>
                      <p className="mt-0.5 text-xs text-charcoal-400">Revelation #{event.order}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:flex-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('timeline')}
              className="inline-flex items-center gap-2 rounded-lg border border-sage-300 px-6 py-3 text-sm font-medium text-sage-700 transition hover:bg-sage-50"
            >
              <Timer className="h-4 w-4" /> Explore the full timeline
            </button>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="bg-sage-600 py-20">
        <div className="mx-auto max-w-3xl px-5 text-center text-white">
          <Sparkles className="mx-auto h-10 w-10 text-sage-200" />
          <h2 className="mt-5 font-serif text-3xl font-semibold md:text-4xl">Ready for the Challenge?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sage-100">
            Twelve questions on the Makkan and Madinan surahs. Build a streak, earn your rank, and claim a place on the leaderboard.
          </p>
          <button
            onClick={() => navigate('quiz')}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 font-medium text-sage-700 transition hover:bg-sage-50 hover:shadow-lg"
          >
            Take the Quiz <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Learn CTA */}
      <section className="bg-ivory-100 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 px-5 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-charcoal-900">Want to learn more?</h2>
            <p className="mt-2 text-charcoal-500">Explore detailed comparisons, educational content, and an AI assistant.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('learn')} className="rounded-lg bg-sage-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sage-700">
              Learn
            </button>
            <button onClick={() => navigate('askai')} className="rounded-lg border border-sage-300 px-6 py-3 text-sm font-medium text-sage-700 transition hover:bg-sage-50">
              Ask AI
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
