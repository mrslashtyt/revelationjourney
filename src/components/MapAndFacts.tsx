import { useEffect, useState } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { DID_YOU_KNOW } from '../data/quiz';
import { OrnamentDivider } from './Decor';

const FACTS = DID_YOU_KNOW;

export function FactsBanner() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % FACTS.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-3xl px-5">
        <div className="card-surface relative overflow-hidden rounded-3xl px-8 py-10 text-center">
          <div className="absolute inset-0 geometric-pattern opacity-50" />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 text-gold-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em]">Did You Know?</span>
              <Sparkles className="h-5 w-5" />
            </div>
            <p
              className={`mt-5 min-h-[3.5rem] font-heading text-xl leading-relaxed text-cream transition-all duration-500 md:text-2xl ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              {FACTS[index]}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {FACTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setVisible(false);
                    setTimeout(() => {
                      setIndex(i);
                      setVisible(true);
                    }, 300);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-gold-400' : 'w-1.5 bg-cream/25 hover:bg-cream/50'
                  }`}
                  aria-label={`Fact ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RevelationMap() {
  const [activeCity, setActiveCity] = useState<'makkah' | 'madinah'>('makkah');

  const cities = {
    makkah: {
      name: 'Makkah',
      arabic: 'مكة المكرمة',
      x: 22,
      y: 62,
      color: 'emerald',
      period: '610–622 CE · 13 years',
      stats: ['86 surahs', 'The Ka-bah', 'Cave of Hira', 'Birthplace of the mission'],
      story:
        'Here, in the cave of Hira on Jabal al-Nur, the first word of the Quran — "Read" — descended upon the Prophet. For thirteen years the call rose in Makkah: pure monotheism against a city of idols, faith against persecution.',
    },
    madinah: {
      name: 'Madinah',
      arabic: 'المدينة المنورة',
      x: 72,
      y: 30,
      color: 'gold',
      period: '622–632 CE · 10 years',
      stats: ['28 surahs', 'The Prophet-s Mosque', 'First Muslim community', 'The constitution and the laws'],
      story:
        'After the Hijrah, revelation built a society: prayer and charity, family and justice, patience in battle and forgiveness in victory. Here the Quran completed its shape — a guide for a whole civilisation.',
    },
  } as const;

  const active = cities[activeCity];

  useEffect(() => {
    const cycle = setInterval(() => {
      setActiveCity((c) => (c === 'makkah' ? 'madinah' : 'makkah'));
    }, 8000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <section id="map" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="font-arabic text-xl text-gold-400">خريطة الوحي</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-cream md:text-5xl">
            The Revelation Map
          </h2>
          <OrnamentDivider className="mt-6" />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-cream/70">
            Two cities, 450 kilometres apart, shaped the final revelation. Trace the journey of the
            divine word across the Arabian desert.
          </p>
        </div>

        <div className="card-surface mt-12 overflow-hidden rounded-3xl">
          <div className="relative h-[380px] bg-gradient-to-br from-night-900 via-night-850 to-night-900 md:h-[440px]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <g stroke="#e9c56a" strokeOpacity="0.12" strokeWidth="0.15" fill="none">
                {Array.from({ length: 9 }, (_, i) => (
                  <path key={`h${i}`} d={`M0 ${10 * (i + 1)} Q 50 ${10 * (i + 1) + 3} 100 ${10 * (i + 1)}`} />
                ))}
                {Array.from({ length: 9 }, (_, i) => (
                  <path key={`v${i}`} d={`M${10 * (i + 1)} 0 Q ${10 * (i + 1) + 2} 50 ${10 * (i + 1)} 100`} />
                ))}
              </g>
              <path
                d={`M ${cities.makkah.x} ${cities.makkah.y} C 40 40, 55 45, ${cities.madinah.x} ${cities.madinah.y}`}
                stroke="#e9c56a"
                strokeWidth="0.5"
                strokeDasharray="2 2"
                fill="none"
                className="animate-dash-flow"
              />
            </svg>

            {(Object.keys(cities) as Array<'makkah' | 'madinah'>).map((key) => {
              const city = cities[key];
              const isActive = activeCity === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCity(key)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${city.x}%`, top: `${city.y}%` }}
                >
                  <span
                    className={`relative flex h-5 w-5 items-center justify-center rounded-full transition-all duration-500 ${
                      isActive
                        ? city.color === 'emerald'
                          ? 'bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.8)]'
                          : 'bg-gold-400 shadow-[0_0_24px_rgba(233,197,106,0.8)]'
                        : 'bg-cream/40 group-hover:bg-cream/70'
                    }`}
                  >
                    {isActive && (
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 ${
                        city.color === 'emerald' ? 'bg-emerald-400' : 'bg-gold-400'
                      }`} />
                    )}
                    <MapPin className="absolute -top-7 h-5 w-5 text-cream/80" />
                  </span>
                  <span
                    className={`absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                      isActive ? 'bg-night-950/90 text-gold-300 border border-gold-500/40' : 'text-cream/60'
                    }`}
                  >
                    {city.name}
                  </span>
                </button>
              );
            })}

            <p className="absolute right-6 top-5 font-arabic text-lg text-gold-400/40">جزيرة العرب</p>
          </div>

          <div className="border-t border-gold-500/15 p-8 md:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h3 className="font-heading text-3xl text-cream">
                  {active.name} <span className="font-arabic text-gold-300">{active.arabic}</span>
                </h3>
                <p className="mt-1 text-sm text-cream/55">{active.period}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveCity('makkah')}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeCity === 'makkah'
                      ? 'bg-emerald-500/25 text-emerald-200'
                      : 'border border-cream/15 text-cream/60 hover:text-cream'
                  }`}
                >
                  Makkah
                </button>
                <button
                  onClick={() => setActiveCity('madinah')}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeCity === 'madinah'
                      ? 'bg-gold-500/25 text-gold-200'
                      : 'border border-cream/15 text-cream/60 hover:text-cream'
                  }`}
                >
                  Madinah
                </button>
              </div>
            </div>
            <p className="mt-5 max-w-3xl leading-relaxed text-cream/75">{active.story}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {active.stats.map((s) => (
                <span
                  key={s}
                  className={`rounded-full px-4 py-1.5 text-sm ${
                    active.color === 'emerald'
                      ? 'bg-emerald-500/12 text-emerald-200 border border-emerald-500/25'
                      : 'bg-gold-500/12 text-gold-200 border border-gold-500/25'
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
