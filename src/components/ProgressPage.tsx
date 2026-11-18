import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck, Clock, Flame, RotateCcw, Sparkles, Trophy, TrendingUp } from 'lucide-react';
import { SURAHS, type Surah } from '../data/surahs';
import { OrnamentDivider } from './Decor';
import { useNav } from './NavContext';

const BOOKMARK_KEY = 'two-eras-bookmarks-v1';
const RECENT_KEY = 'two-eras-recent-v1';
const LEADERBOARD_KEY = 'two-eras-leaderboard-v1';

interface LeaderboardRow {
  id: string;
  player_name: string;
  score: number;
  total: number;
  best_streak: number;
  created_at: string;
}

function loadBookmarks(): number[] {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]'); } catch { return []; }
}
function loadRecent(): number[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function loadLeaderboard(): LeaderboardRow[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const rows = JSON.parse(raw) as LeaderboardRow[];
    return rows.sort((a, b) => b.score - a.score || b.best_streak - a.best_streak).slice(0, 8);
  } catch { return []; }
}

export function ProgressPage() {
  const { navigate } = useNav();
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [recent, setRecent] = useState<number[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    setBookmarks(loadBookmarks());
    setRecent(loadRecent());
    setLeaderboard(loadLeaderboard());
  }, []);

  const bookmarkedSurahs = bookmarks.map((n) => SURAHS.find((s) => s.number === n)).filter(Boolean) as Surah[];
  const recentSurahs = recent.map((n) => SURAHS.find((s) => s.number === n)).filter(Boolean) as Surah[];
  const bestScore = leaderboard.length > 0 ? Math.max(...leaderboard.map((r) => r.score)) : 0;
  const bestStreak = leaderboard.length > 0 ? Math.max(...leaderboard.map((r) => r.best_streak)) : 0;
  const totalQuizzes = leaderboard.length;

  const removeBookmark = (n: number) => {
    setBookmarks((b) => b.filter((x) => x !== n));
    try {
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks.filter((x) => x !== n)));
    } catch { /* */ }
  };

  return (
    <div className="min-h-screen bg-ivory-50 animate-fade-in">
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-20">
        <div className="text-center">
          <p className="font-arabic text-lg text-sage-500">تقدمي التعليمي</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 md:text-5xl">My Learning</h1>
          <OrnamentDivider className="mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-charcoal-500">
            Track your progress through the two eras of revelation. Your bookmarks, recently viewed surahs, and quiz results are saved on this device.
          </p>
        </div>

        {/* Stats overview */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="card-surface-elevated rounded-2xl p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-sage-100">
              <BookmarkCheck className="h-5 w-5 text-sage-600" />
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold text-charcoal-900">{bookmarkedSurahs.length}</p>
            <p className="text-xs uppercase tracking-[0.15em] text-charcoal-400">Bookmarked Surahs</p>
          </div>
          <div className="card-surface-elevated rounded-2xl p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-sand-100">
              <Clock className="h-5 w-5 text-sand-500" />
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold text-charcoal-900">{recentSurahs.length}</p>
            <p className="text-xs uppercase tracking-[0.15em] text-charcoal-400">Recently Viewed</p>
          </div>
          <div className="card-surface-elevated rounded-2xl p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-bronze-300/30">
              <Trophy className="h-5 w-5 text-bronze-500" />
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold text-charcoal-900">{totalQuizzes}</p>
            <p className="text-xs uppercase tracking-[0.15em] text-charcoal-400">Quizzes Taken</p>
          </div>
        </div>

        {/* Best quiz performance */}
        {leaderboard.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="card-surface rounded-xl p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sage-100">
                <TrendingUp className="h-6 w-6 text-sage-600" />
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold text-charcoal-900">{bestScore}/{leaderboard[0]?.total || 12}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-charcoal-400">Best Score</p>
              </div>
            </div>
            <div className="card-surface rounded-xl p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold text-charcoal-900">{bestStreak}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-charcoal-400">Best Streak</p>
              </div>
            </div>
          </div>
        )}

        {/* Bookmarked Surahs */}
        <div className="mt-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-charcoal-900">
              <Bookmark className="h-5 w-5 text-sand-500" /> Bookmarked Surahs
            </h2>
            {bookmarkedSurahs.length > 0 && (
              <button onClick={() => navigate('explorer')} className="text-sm font-medium text-sage-600 hover:text-sage-700">
                Open Explorer →
              </button>
            )}
          </div>

          {bookmarkedSurahs.length === 0 ? (
            <div className="card-surface rounded-xl p-10 text-center">
              <Bookmark className="mx-auto h-8 w-8 text-charcoal-200" />
              <p className="mt-3 text-charcoal-400">No bookmarks yet. Save surahs from the Surah Explorer to find them here.</p>
              <button onClick={() => navigate('explorer')} className="mt-4 rounded-lg bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-sage-700">
                Browse Surahs
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {bookmarkedSurahs.map((s) => (
                <div key={s.number} className="card-surface rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg font-serif text-sm font-semibold ${
                      s.era === 'Makkan' ? 'bg-sage-100 text-sage-700' : 'bg-sand-100 text-sand-600'
                    }`}>
                      {s.number}
                    </span>
                    <button onClick={() => removeBookmark(s.number)} className="text-charcoal-300 transition hover:text-red-400" aria-label="Remove bookmark">
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-3 font-serif text-lg font-semibold text-charcoal-900">{s.nameEn}</p>
                  <p className="font-arabic text-2xl text-charcoal-600">{s.nameAr}</p>
                  <p className="mt-1 text-xs text-charcoal-400">{s.verses} verses · {s.era}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        <div className="mt-14">
          <h2 className="mb-5 flex items-center gap-2 font-serif text-xl font-semibold text-charcoal-900">
            <Clock className="h-5 w-5 text-sage-500" /> Recently Viewed
          </h2>

          {recentSurahs.length === 0 ? (
            <div className="card-surface rounded-xl p-10 text-center">
              <Clock className="mx-auto h-8 w-8 text-charcoal-200" />
              <p className="mt-3 text-charcoal-400">No surahs viewed yet. Explore the Surah Explorer to start your journey.</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
              {recentSurahs.map((s) => (
                <button
                  key={s.number}
                  onClick={() => navigate('explorer')}
                  className="card-surface shrink-0 rounded-lg px-5 py-3 text-left transition hover:shadow-sm"
                >
                  <span className="block font-serif text-sm font-medium text-charcoal-900">{s.nameEn}</span>
                  <span className="block font-arabic text-lg text-sage-500">{s.nameAr}</span>
                  <span className="mt-1 block text-xs text-charcoal-400">{s.era}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quiz Results */}
        <div className="mt-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-charcoal-900">
              <Sparkles className="h-5 w-5 text-sage-500" /> Quiz Results
            </h2>
            {leaderboard.length > 0 && (
              <button onClick={() => navigate('quiz')} className="text-sm font-medium text-sage-600 hover:text-sage-700">
                Take Another Quiz →
              </button>
            )}
          </div>

          {leaderboard.length === 0 ? (
            <div className="card-surface rounded-xl p-10 text-center">
              <Trophy className="mx-auto h-8 w-8 text-charcoal-200" />
              <p className="mt-3 text-charcoal-400">No quizzes taken yet. Test your knowledge to see your results here.</p>
              <button onClick={() => navigate('quiz')} className="mt-4 rounded-lg bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-sage-700">
                Take a Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((row, i) => (
                <div key={row.id} className={`card-surface flex items-center gap-4 rounded-xl px-5 py-3.5 ${i === 0 ? 'border-sand-300' : ''}`}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif font-semibold ${
                    i === 0 ? 'bg-sand-400 text-white' : i === 1 ? 'bg-charcoal-200 text-charcoal-700' : i === 2 ? 'bg-bronze-300/50 text-bronze-500' : 'bg-ivory-200 text-charcoal-500'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate font-medium text-charcoal-800">{row.player_name}</span>
                  <span className="flex items-center gap-1 text-xs text-charcoal-400">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    {row.best_streak}
                  </span>
                  <span className="font-serif text-lg font-semibold text-sage-700">{row.score}/{row.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
