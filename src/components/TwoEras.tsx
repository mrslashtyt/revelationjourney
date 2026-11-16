import { CloudRain, Home, Landmark, Scale, Scroll, Swords, Users } from 'lucide-react';
import { SURAHS } from '../data/surahs';
import { useCountUp, useInView } from '../hooks/useInView';
import { OrnamentDivider } from './Decor';

function Stat({ target, suffix, label }: { target: number; suffix?: string; label: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const value = useCountUp(target, inView);
  return (
    <span ref={ref} className="font-heading text-4xl font-semibold text-gold-300 md:text-5xl">
      {value.toLocaleString()}
      {suffix}
      <span className="mt-1 block font-body text-xs font-normal uppercase tracking-[0.2em] text-cream/60">
        {label}
      </span>
    </span>
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
  const makkanCount = SURAHS.filter((s) => s.era === 'Makkan').length;
  const madinanCount = SURAHS.filter((s) => s.era === 'Madinan').length;
  const totalVerses = SURAHS.reduce((sum, s) => sum + s.verses, 0);

  return (
    <section id="eras" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="font-arabic text-xl text-gold-400">مكان وزمان الوحي</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-cream md:text-5xl">
            One Revelation, Two Cities
          </h2>
          <OrnamentDivider className="mt-6" />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-cream/70">
            Every surah belongs to one of two great periods. Understanding where and when it was
            revealed unlocks why its tone, length, and themes are so distinct.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="group card-surface rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/40 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.25)]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-emerald-300">
                Makkan
              </span>
              <span className="font-arabic text-2xl text-emerald-300/80">مكية</span>
            </div>
            <h3 className="mt-5 font-heading text-3xl text-cream">The Makkan Period</h3>
            <p className="mt-1 text-sm text-cream/60">c. 610–622 CE · 13 years · The Cave of Hira to the Hijrah</p>
            <ul className="mt-7 space-y-4">
              {MAKKAH_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3.5 text-sm leading-relaxed text-cream/80">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="group card-surface rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold-400/40 hover:shadow-[0_20px_60px_-15px_rgba(233,197,106,0.25)]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-gold-500/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-gold-300">
                Madinan
              </span>
              <span className="font-arabic text-2xl text-gold-300/80">مدنية</span>
            </div>
            <h3 className="mt-5 font-heading text-3xl text-cream">The Madinan Period</h3>
            <p className="mt-1 text-sm text-cream/60">c. 622–632 CE · 10 years · The Hijrah to the Farewell Pilgrimage</p>
            <ul className="mt-7 space-y-4">
              {MADINAH_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3.5 text-sm leading-relaxed text-cream/80">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 text-gold-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-start justify-center gap-10 rounded-3xl card-surface px-8 py-10 md:gap-20">
          <Stat target={makkanCount} label="Makkan Surahs" />
          <Stat target={madinanCount} label="Madinan Surahs" />
          <Stat target={114} label="Total Surahs" />
          <Stat target={totalVerses} label="Verses in the Quran" />
        </div>
      </div>
    </section>
  );
}
