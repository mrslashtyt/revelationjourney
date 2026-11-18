import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { OrnamentDivider } from './Decor';

export function RevelationMap() {
  const [activeCity, setActiveCity] = useState<'makkah' | 'madinah'>('makkah');

  const cities = {
    makkah: {
      name: 'Makkah',
      arabic: 'مكة المكرمة',
      x: 22,
      y: 62,
      isMakkah: true,
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
      isMakkah: false,
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
    <div className="min-h-screen bg-ivory-50 animate-fade-in">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
        <div className="text-center">
          <p className="font-arabic text-lg text-sage-500">خريطة الوحي</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 md:text-5xl">The Revelation Map</h1>
          <OrnamentDivider className="mt-5" />
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-charcoal-500">
            Two cities, 450 kilometres apart, shaped the final revelation. Trace the journey of the divine word across the Arabian desert.
          </p>
        </div>

        <div className="card-surface-elevated mt-12 overflow-hidden rounded-2xl">
          <div className="relative h-[380px] bg-gradient-to-br from-sage-50 via-ivory-100 to-sand-50 md:h-[440px]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <g stroke="#858C70" strokeOpacity="0.1" strokeWidth="0.15" fill="none">
                {Array.from({ length: 9 }, (_, i) => (
                  <path key={`h${i}`} d={`M0 ${10 * (i + 1)} Q 50 ${10 * (i + 1) + 3} 100 ${10 * (i + 1)}`} />
                ))}
                {Array.from({ length: 9 }, (_, i) => (
                  <path key={`v${i}`} d={`M${10 * (i + 1)} 0 Q ${10 * (i + 1) + 2} 50 ${10 * (i + 1)} 100`} />
                ))}
              </g>
              <path
                d={`M ${cities.makkah.x} ${cities.makkah.y} C 40 40, 55 45, ${cities.madinah.x} ${cities.madinah.y}`}
                stroke="#B49A76"
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
                        ? city.isMakkah
                          ? 'bg-sage-500 shadow-md'
                          : 'bg-sand-400 shadow-md'
                        : 'bg-charcoal-300 group-hover:bg-charcoal-400'
                    }`}
                  >
                    {isActive && (
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-30 ${
                        city.isMakkah ? 'bg-sage-500' : 'bg-sand-400'
                      }`} />
                    )}
                    <MapPin className="absolute -top-7 h-5 w-5 text-charcoal-600" />
                  </span>
                  <span
                    className={`absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                      isActive ? 'bg-white text-charcoal-800 border border-charcoal-200 shadow-sm' : 'text-charcoal-500'
                    }`}
                  >
                    {city.name}
                  </span>
                </button>
              );
            })}

            <p className="absolute right-6 top-5 font-arabic text-lg text-sage-400/40">جزيرة العرب</p>
          </div>

          <div className="border-t border-charcoal-200/50 p-8 md:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h3 className="font-serif text-3xl font-semibold text-charcoal-900">
                  {active.name} <span className={`font-arabic ${active.isMakkah ? 'text-sage-500' : 'text-sand-500'}`}>{active.arabic}</span>
                </h3>
                <p className="mt-1 text-sm text-charcoal-400">{active.period}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveCity('makkah')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCity === 'makkah'
                      ? 'bg-sage-100 text-sage-700'
                      : 'border border-charcoal-200 text-charcoal-500 hover:bg-ivory-100'
                  }`}
                >
                  Makkah
                </button>
                <button
                  onClick={() => setActiveCity('madinah')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCity === 'madinah'
                      ? 'bg-sand-100 text-sand-600'
                      : 'border border-charcoal-200 text-charcoal-500 hover:bg-ivory-100'
                  }`}
                >
                  Madinah
                </button>
              </div>
            </div>
            <p className="mt-5 max-w-3xl leading-relaxed text-charcoal-600">{active.story}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {active.stats.map((s) => (
                <span
                  key={s}
                  className={`rounded-full px-4 py-1.5 text-sm ${
                    active.isMakkah
                      ? 'bg-sage-50 text-sage-700 border border-sage-200'
                      : 'bg-sand-50 text-sand-600 border border-sand-200'
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
