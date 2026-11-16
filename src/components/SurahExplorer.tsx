import { useMemo, useState } from 'react';
import { ArrowUpDown, Search, X } from 'lucide-react';
import { SURAHS, type Era, type Surah } from '../data/surahs';
import { OrnamentDivider } from './Decor';

type EraFilter = 'All' | Era;
type SortMode = 'chapter' | 'chronological' | 'verses';

function SurahRow({ surah, onOpen }: { surah: Surah; onOpen: (s: Surah) => void }) {
  const makkan = surah.era === 'Makkan';
  return (
    <button
      onClick={() => onOpen(surah)}
      className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 card-surface ${
        makkan ? 'hover:border-emerald-400/50 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)]'
               : 'hover:border-gold-400/50 hover:shadow-[0_10px_30px_-10px_rgba(233,197,106,0.3)]'
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-heading text-lg font-semibold ${
          makkan ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gold-500/15 text-gold-300'
        }`}
      >
        {surah.number}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-heading text-lg text-cream">
          {surah.nameEn}
          <span className="ml-2 text-sm text-cream/50">{surah.meaning}</span>
        </span>
        <span className="mt-0.5 block text-xs uppercase tracking-[0.15em] text-cream/45">
          {surah.verses} verses · revealed #{surah.chronologicalOrder}
        </span>
      </span>
      <span className={`hidden shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider sm:block ${
        makkan ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gold-500/15 text-gold-300'
      }`}>
        {surah.era}
      </span>
      <span className="shrink-0 font-arabic text-2xl text-cream/85 transition-colors group-hover:text-gold-300">
        {surah.nameAr}
      </span>
    </button>
  );
}

function DetailPanel({ surah, onClose }: { surah: Surah; onClose: () => void }) {
  const makkan = surah.era === 'Makkan';
  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeUp_0.3s_ease-out]" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-gold-500/25 bg-night-900 p-8 shadow-2xl animate-[fadeUp_0.4s_ease-out]">
        <div className="flex items-start justify-between">
          <div>
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${
                makkan ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gold-500/15 text-gold-300'
              }`}
            >
              {surah.era} · Revealed #{surah.chronologicalOrder}
            </span>
            <h3 className="mt-4 font-heading text-3xl font-semibold text-cream">{surah.nameEn}</h3>
            <p className="text-sm italic text-cream/60">"{surah.meaning}"</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-cream/60 transition hover:bg-gold-500/10 hover:text-gold-300"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-6 text-right font-arabic text-4xl leading-snug text-gold-300">{surah.nameAr}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="card-surface rounded-xl p-4 text-center">
            <p className="font-heading text-3xl text-gold-300">{surah.number}</p>
            <p className="text-xs uppercase tracking-widest text-cream/50">Chapter</p>
          </div>
          <div className="card-surface rounded-xl p-4 text-center">
            <p className="font-heading text-3xl text-gold-300">{surah.verses}</p>
            <p className="text-xs uppercase tracking-widest text-cream/50">Verses</p>
          </div>
        </div>

        <p className="mt-6 leading-relaxed text-cream/80">{surah.summary}</p>

        <h4 className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Key Themes</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {surah.themes.map((t) => (
            <span key={t} className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1.5 text-sm text-gold-200">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SurahExplorer() {
  const [query, setQuery] = useState('');
  const [eraFilter, setEraFilter] = useState<EraFilter>('All');
  const [sortMode, setSortMode] = useState<SortMode>('chapter');
  const [selected, setSelected] = useState<Surah | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = SURAHS.filter((s) => {
      const matchesQuery =
        !q ||
        s.nameEn.toLowerCase().includes(q) ||
        s.meaning.toLowerCase().includes(q) ||
        s.nameAr.includes(query.trim()) ||
        String(s.number) === q;
      const matchesEra = eraFilter === 'All' || s.era === eraFilter;
      return matchesQuery && matchesEra;
    });
    return [...list].sort((a, b) => {
      if (sortMode === 'chronological') return a.chronologicalOrder - b.chronologicalOrder;
      if (sortMode === 'verses') return b.verses - a.verses;
      return a.number - b.number;
    });
  }, [query, eraFilter, sortMode]);

  return (
    <section id="explorer" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="font-arabic text-xl text-gold-400">استكشف السور</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-cream md:text-5xl">
            Explorer of the 114 Surahs
          </h2>
          <OrnamentDivider className="mt-6" />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-cream/70">
            Search, filter, and sort every surah in the Quran. Click any card to open its story,
            themes, and place in the revelation.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-cream/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, meaning, or number…"
              className="w-full rounded-full border border-gold-500/25 bg-night-900/80 py-3 pl-11 pr-4 text-cream placeholder:text-cream/35 outline-none transition focus:border-gold-400/60 focus:shadow-[0_0_0_3px_rgba(233,197,106,0.12)]"
            />
          </div>
          <div className="flex gap-2">
            {(['All', 'Makkan', 'Madinan'] as EraFilter[]).map((era) => (
              <button
                key={era}
                onClick={() => setEraFilter(era)}
                className={`rounded-full px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  eraFilter === era
                    ? era === 'Makkan'
                      ? 'bg-emerald-500/25 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                      : era === 'Madinan'
                        ? 'bg-gold-500/25 text-gold-200 shadow-[0_0_16px_rgba(233,197,106,0.3)]'
                        : 'bg-gold-400 text-night-950'
                    : 'border border-cream/15 text-cream/60 hover:border-gold-500/40 hover:text-gold-300'
                }`}
              >
                {era}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-3xl items-center justify-between text-sm text-cream/50">
          <span>
            {filtered.length} surah{filtered.length === 1 ? '' : 's'} found
          </span>
          <button
            onClick={() =>
              setSortMode((m) => (m === 'chapter' ? 'chronological' : m === 'chronological' ? 'verses' : 'chapter'))
            }
            className="flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 transition hover:border-gold-500/40 hover:text-gold-300"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort: {sortMode === 'chapter' ? 'Chapter order' : sortMode === 'chronological' ? 'Revelation order' : 'Verse count'}
          </button>
        </div>

        <div className="mx-auto mt-6 grid max-w-5xl gap-3 md:grid-cols-2">
          {filtered.map((surah) => (
            <SurahRow key={surah.number} surah={surah} onOpen={setSelected} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-cream/50">
            No surah matches "{query}". Try a different search.
          </p>
        )}
      </div>

      {selected && <DetailPanel surah={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
