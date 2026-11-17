import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpDown, Bookmark, BookmarkCheck, Clock, Compass, Search, X } from 'lucide-react';
import { SURAHS, type Era, type Surah } from '../data/surahs';
import { useNav } from './NavContext';
import { OrnamentDivider } from './Decor';

type EraFilter = 'All' | Era;
type SortMode = 'chapter' | 'chronological' | 'verses';

const BOOKMARK_KEY = 'two-eras-bookmarks-v1';
const RECENT_KEY = 'two-eras-recent-v1';

function loadBookmarks(): number[] {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]'); } catch { return []; }
}
function loadRecent(): number[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}

function SurahCard({ surah, onOpen, bookmarked, onBookmark }: {
  surah: Surah;
  onOpen: (s: Surah) => void;
  bookmarked: boolean;
  onBookmark: (n: number) => void;
}) {
  const makkan = surah.era === 'Makkan';
  return (
    <div
      className={`group card-surface rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        makkan ? 'hover:border-sage-300' : 'hover:border-sand-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-serif text-base font-semibold ${
          makkan ? 'bg-sage-100 text-sage-700' : 'bg-sand-100 text-sand-600'
        }`}>
          {surah.number}
        </span>
        <button
          onClick={() => onBookmark(surah.number)}
          className="text-charcoal-300 transition hover:text-sand-500"
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark surah'}
        >
          {bookmarked ? <BookmarkCheck className="h-4 w-4 text-sand-500" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>
      <button onClick={() => onOpen(surah)} className="mt-3 block w-full text-left">
        <span className="block font-serif text-lg font-semibold text-charcoal-900">{surah.nameEn}</span>
        <span className="block text-xs text-charcoal-400">"{surah.meaning}"</span>
        <span className="mt-2 block font-arabic text-2xl text-charcoal-700 transition group-hover:text-sage-600">{surah.nameAr}</span>
        <span className="mt-2 flex items-center gap-2 text-xs text-charcoal-400">
          {surah.verses} verses · revealed #{surah.chronologicalOrder}
        </span>
      </button>
      <div className="mt-3 flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
          makkan ? 'bg-sage-50 text-sage-600' : 'bg-sand-50 text-sand-600'
        }`}>
          {surah.era}
        </span>
        <button
          onClick={() => onOpen(surah)}
          className="text-charcoal-300 opacity-0 transition group-hover:opacity-100"
          aria-label="View details"
        >
          <ArrowRight className="h-4 w-4 text-sage-600" />
        </button>
      </div>
    </div>
  );
}

function DetailPanel({ surah, onClose, onNavigate }: { surah: Surah; onClose: () => void; onNavigate: () => void }) {
  const makkan = surah.era === 'Makkan';
  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center md:justify-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-charcoal-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg animate-slide-in-right rounded-t-2xl bg-white p-7 shadow-xl md:rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
              makkan ? 'bg-sage-100 text-sage-700' : 'bg-sand-100 text-sand-600'
            }`}>
              {surah.era} · Revealed #{surah.chronologicalOrder}
            </span>
            <h3 className="mt-3 font-serif text-2xl font-semibold text-charcoal-900">{surah.nameEn}</h3>
            <p className="text-sm italic text-charcoal-500">"{surah.meaning}"</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-charcoal-400 transition hover:bg-ivory-200 hover:text-charcoal-700" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-5 text-right font-arabic text-4xl leading-snug text-sage-600" dir="rtl">{surah.nameAr}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-ivory-100 p-4 text-center">
            <p className="font-serif text-2xl font-semibold text-charcoal-900">{surah.number}</p>
            <p className="text-xs uppercase tracking-wider text-charcoal-400">Chapter</p>
          </div>
          <div className="rounded-xl bg-ivory-100 p-4 text-center">
            <p className="font-serif text-2xl font-semibold text-charcoal-900">{surah.verses}</p>
            <p className="text-xs uppercase tracking-wider text-charcoal-400">Verses</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-charcoal-600">{surah.summary}</p>

        <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-sage-500">Key Themes</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {surah.themes.map((t) => (
            <span key={t} className="rounded-full bg-sage-50 px-3 py-1.5 text-xs text-sage-700">{t}</span>
          ))}
        </div>

        <button
          onClick={onNavigate}
          className="mt-6 w-full rounded-lg bg-sage-600 py-3 text-sm font-medium text-white transition hover:bg-sage-700"
        >
          View on the Timeline
        </button>
      </div>
    </div>
  );
}

export function SurahExplorer() {
  const { navigate } = useNav();
  const [query, setQuery] = useState('');
  const [eraFilter, setEraFilter] = useState<EraFilter>('All');
  const [sortMode, setSortMode] = useState<SortMode>('chapter');
  const [selected, setSelected] = useState<Surah | null>(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>(loadBookmarks);
  const [recent, setRecent] = useState<number[]>(loadRecent);

  useEffect(() => {
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks)); } catch { /* */ }
  }, [bookmarks]);
  useEffect(() => {
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(recent)); } catch { /* */ }
  }, [recent]);

  const toggleBookmark = (n: number) => {
    setBookmarks((b) => b.includes(n) ? b.filter((x) => x !== n) : [...b, n]);
  };

  const openSurah = (s: Surah) => {
    setSelected(s);
    setRecent((r) => [s.number, ...r.filter((n) => n !== s.number)].slice(0, 8));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = SURAHS.filter((s) => {
      const matchesQuery = !q || s.nameEn.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q) || s.nameAr.includes(query.trim()) || String(s.number) === q;
      const matchesEra = eraFilter === 'All' || s.era === eraFilter;
      const matchesBookmark = !showBookmarksOnly || bookmarks.includes(s.number);
      return matchesQuery && matchesEra && matchesBookmark;
    });
    return [...list].sort((a, b) => {
      if (sortMode === 'chronological') return a.chronologicalOrder - b.chronologicalOrder;
      if (sortMode === 'verses') return b.verses - a.verses;
      return a.number - b.number;
    });
  }, [query, eraFilter, sortMode, showBookmarksOnly, bookmarks]);

  const recentSurahs = recent.map((n) => SURAHS.find((s) => s.number === n)).filter(Boolean) as Surah[];
  const bookmarkedSurahs = bookmarks.map((n) => SURAHS.find((s) => s.number === n)).filter(Boolean) as Surah[];

  return (
    <div className="min-h-screen bg-ivory-50 animate-fade-in">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
        <div className="text-center">
          <p className="font-arabic text-lg text-sage-500">استكشف السور</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 md:text-5xl">Surah Explorer</h1>
          <OrnamentDivider className="mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-charcoal-500">
            Search, filter, and sort every surah in the Quran. Bookmark your favourites and click any card to open its story.
          </p>
        </div>

        {/* Recently explored */}
        {recentSurahs.length > 0 && !query && eraFilter === 'All' && !showBookmarksOnly && (
          <div className="mt-10">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-400">
              <Clock className="h-3.5 w-3.5" /> Recently Explored
            </h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {recentSurahs.slice(0, 6).map((s) => (
                <button
                  key={s.number}
                  onClick={() => openSurah(s)}
                  className="card-surface shrink-0 rounded-lg px-4 py-2.5 text-left transition hover:shadow-sm"
                >
                  <span className="block font-serif text-sm font-medium text-charcoal-900">{s.nameEn}</span>
                  <span className="block font-arabic text-lg text-sage-500">{s.nameAr}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarked surahs */}
        {bookmarkedSurahs.length > 0 && !showBookmarksOnly && !query && eraFilter === 'All' && (
          <div className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-400">
              <BookmarkCheck className="h-3.5 w-3.5 text-sand-500" /> Bookmarked
            </h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {bookmarkedSurahs.slice(0, 6).map((s) => (
                <button
                  key={s.number}
                  onClick={() => openSurah(s)}
                  className="card-surface shrink-0 rounded-lg px-4 py-2.5 text-left transition hover:shadow-sm"
                >
                  <span className="block font-serif text-sm font-medium text-charcoal-900">{s.nameEn}</span>
                  <span className="block font-arabic text-lg text-sand-500">{s.nameAr}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search and filters */}
        <div className="mt-10 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, meaning, or number..."
              className="w-full rounded-lg border border-charcoal-200 bg-white py-3 pl-11 pr-4 text-charcoal-800 placeholder:text-charcoal-300 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['All', 'Makkan', 'Madinan'] as EraFilter[]).map((era) => (
              <button
                key={era}
                onClick={() => setEraFilter(era)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  eraFilter === era
                    ? era === 'Makkan' ? 'bg-sage-600 text-white' : era === 'Madinan' ? 'bg-sand-400 text-white' : 'bg-charcoal-900 text-white'
                    : 'border border-charcoal-200 text-charcoal-500 hover:bg-ivory-100'
                }`}
              >
                {era}
              </button>
            ))}
            <button
              onClick={() => setShowBookmarksOnly((v) => !v)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-3 text-sm font-medium transition ${
                showBookmarksOnly ? 'bg-sand-400 text-white' : 'border border-charcoal-200 text-charcoal-500 hover:bg-ivory-100'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" /> Saved
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-charcoal-400">
          <span>{filtered.length} surah{filtered.length === 1 ? '' : 's'} found</span>
          <button
            onClick={() => setSortMode((m) => m === 'chapter' ? 'chronological' : m === 'chronological' ? 'verses' : 'chapter')}
            className="flex items-center gap-2 rounded-lg border border-charcoal-200 px-3.5 py-2 transition hover:bg-ivory-100"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortMode === 'chapter' ? 'Chapter order' : sortMode === 'chronological' ? 'Revelation order' : 'Verse count'}
          </button>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((surah) => (
            <SurahCard
              key={surah.number}
              surah={surah}
              onOpen={openSurah}
              bookmarked={bookmarks.includes(surah.number)}
              onBookmark={toggleBookmark}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <Compass className="mx-auto h-10 w-10 text-charcoal-200" />
            <p className="mt-4 text-charcoal-400">No surah matches "{query}". Try a different search.</p>
          </div>
        )}
      </div>

      {selected && (
        <DetailPanel
          surah={selected}
          onClose={() => setSelected(null)}
          onNavigate={() => { setSelected(null); navigate('timeline'); }}
        />
      )}
    </div>
  );
}
