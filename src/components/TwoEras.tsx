import { CloudRain, Home, Landmark, Scale, Scroll, Swords, Users } from 'lucide-react';
import { SURAHS } from '../data/surahs';
import { useCountUp, useInView } from '../hooks/useInView';
import { OrnamentDivider } from './Decor';

function CountStat({ target, label }: { target: number; label: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const value = useCountUp(target, inView);
  return (
    <span ref={ref} className="font-serif text-3xl font-semibold text-charcoal-900 md:text-4xl">
      {value.toLocaleString()}
      <span className="mt-1 block font-body text-xs font-normal uppercase tracking-[0.15em] text-charcoal-400">{label}</span>
    </span>
  );
}

function InsightBar({ label, value, maxValue, display, color, delay }: { label: string; value: number; maxValue: number; display: string; color: string; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-charcoal-700">{label}</span>
        <span className="font-serif text-base font-semibold text-charcoal-900">{display}</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ivory-200">
        <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: inView ? `${(value / maxValue) * 100}%` : '0%', transitionDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}

const MAKKAH_POINTS = [
  { icon: CloudRain, text: 'Revealed before the Hijrah, during 13 years of calling people to pure monotheism' },
  { icon: Scroll, text: 'Short, powerful passages with rhythmic, striking language that moved hearts' },
  { icon: Scale, text: 'Focus on belief, the Hereafter, and accountability — building faith first' },
  { icon: Users, text: 'Addressed often to "O mankind" — a universal call in a society of idols' },
];

const MADINAH_POINTS = [
  { icon: Home, text: 'Revealed after the Hijrah, as the young Muslim community took shape' },
  { icon: Landmark, text: 'Longer chapters laying down law: worship, family, trade, and justice' },
  { icon: Users, text: 'Focus on community, character, and relations with other nations' },
  { icon: Swords, text: 'Addressed often to "O you who believe" — guidance for a living society' },
];

export function TwoEras() {
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
    <div className="min-h-screen bg-ivory-50 animate-fade-in">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
        <div className="text-center">
          <p className="font-arabic text-lg text-sage-500">مكان وزمان الوحي</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 md:text-5xl">One Revelation, Two Cities</h1>
          <OrnamentDivider className="mt-5" />
          <p className="mx-auto mt-5 max-w-2xl text-charcoal-500">
            Every surah belongs to one of two great periods. Understanding where and when it was revealed unlocks why its tone, length, and themes are so distinct.
          </p>
        </div>

        {/* Comparison cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="card-surface-elevated rounded-2xl p-8 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-sage-100 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-sage-700">Makkan</span>
              <span className="font-arabic text-2xl text-sage-400">مكية</span>
            </div>
            <h3 className="mt-5 font-serif text-2xl font-semibold text-charcoal-900">The Makkan Period</h3>
            <p className="mt-1 text-sm text-charcoal-400">c. 610–622 CE · 13 years · The Cave of Hira to the Hijrah</p>
            <ul className="mt-6 space-y-3.5">
              {MAKKAH_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 text-sm leading-relaxed text-charcoal-700">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sage-50 text-sage-600"><Icon className="h-4 w-4" /></span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface-elevated rounded-2xl p-8 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-sand-100 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-sand-600">Madinan</span>
              <span className="font-arabic text-2xl text-sand-400">مدنية</span>
            </div>
            <h3 className="mt-5 font-serif text-2xl font-semibold text-charcoal-900">The Madinan Period</h3>
            <p className="mt-1 text-sm text-charcoal-400">c. 622–632 CE · 10 years · The Hijrah to the Farewell Pilgrimage</p>
            <ul className="mt-6 space-y-3.5">
              {MADINAH_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 text-sm leading-relaxed text-charcoal-700">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sand-50 text-sand-600"><Icon className="h-4 w-4" /></span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-10 rounded-2xl bg-white px-8 py-10 md:gap-16">
          <CountStat target={makkan.length} label="Makkan Surahs" />
          <CountStat target={madinan.length} label="Madinan Surahs" />
          <CountStat target={114} label="Total Surahs" />
          <CountStat target={makkanVerses + madinanVerses} label="Total Verses" />
        </div>

        {/* Insights */}
        <div className="mt-10">
          <h2 className="mb-2 text-center font-serif text-2xl font-semibold text-charcoal-900">The Two Eras in Numbers</h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-charcoal-500">
            {makkan.length} Makkan surahs carry {makkanVerses.toLocaleString()} verses — while the {madinan.length} Madinan surahs carry {madinanVerses.toLocaleString()}. The message of faith came in short passages; the laws of society in long chapters.
          </p>

          <div className="card-surface-elevated space-y-6 rounded-2xl p-8 md:p-10">
            <InsightBar label="Verses revealed in Makkah" value={makkanVerses} maxValue={maxVerses} display={makkanVerses.toLocaleString()} color="bg-sage-500" delay={0} />
            <InsightBar label="Verses revealed in Madinah" value={madinanVerses} maxValue={maxVerses} display={madinanVerses.toLocaleString()} color="bg-sand-400" delay={150} />
            <div className="border-t border-charcoal-200/40 pt-6">
              <InsightBar label="Average Makkan surah length" value={makkanAvg} maxValue={Math.max(makkanAvg, madinanAvg)} display={`~ ${makkanAvg} verses`} color="bg-sage-500" delay={300} />
              <div className="mt-6">
                <InsightBar label="Average Madinan surah length" value={madinanAvg} maxValue={Math.max(makkanAvg, madinanAvg)} display={`~ ${madinanAvg} verses`} color="bg-sand-400" delay={450} />
              </div>
            </div>
            <div className="grid gap-4 border-t border-charcoal-200/40 pt-6 text-center sm:grid-cols-2">
              <div className="rounded-xl bg-ivory-100 px-6 py-5">
                <p className="text-xs uppercase tracking-[0.15em] text-charcoal-400">Longest surah</p>
                <p className="mt-2 font-serif text-xl font-semibold text-charcoal-900">{longest.nameEn} <span className="font-arabic text-sage-500">{longest.nameAr}</span></p>
                <p className="mt-1 text-xs text-charcoal-400">{longest.verses} verses · {longest.era}</p>
              </div>
              <div className="rounded-xl bg-ivory-100 px-6 py-5">
                <p className="text-xs uppercase tracking-[0.15em] text-charcoal-400">Shortest surah</p>
                <p className="mt-2 font-serif text-xl font-semibold text-charcoal-900">{shortest.nameEn} <span className="font-arabic text-sage-500">{shortest.nameAr}</span></p>
                <p className="mt-1 text-xs text-charcoal-400">{shortest.verses} verses · {shortest.era}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
