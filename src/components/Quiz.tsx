import { useEffect, useMemo, useState } from 'react';
import { Award, Check, Crown, Flame, RotateCcw, Trash2, Trophy, X, Zap } from 'lucide-react';
import { buildQuiz, type QuizQuestion } from '../data/quiz';
import { OrnamentDivider } from './Decor';

interface LeaderboardRow {
  id: string;
  player_name: string;
  score: number;
  total: number;
  best_streak: number;
  created_at: string;
}

const STORAGE_KEY = 'two-eras-leaderboard-v1';

function loadLeaderboard(): LeaderboardRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const rows = JSON.parse(raw) as LeaderboardRow[];
    return rows.sort((a, b) => b.score - a.score || b.best_streak - a.best_streak).slice(0, 8);
  } catch {
    return [];
  }
}

function saveLeaderboard(rows: LeaderboardRow[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, 50)));
  } catch {
    // storage unavailable
  }
}

function rankTitle(percentage: number): { title: string; note: string } {
  if (percentage >= 90) return { title: 'Hafiz of the Two Eras', note: 'Outstanding — you know the revelation like a scholar.' };
  if (percentage >= 70) return { title: 'Student of Revelation', note: 'Strong work — the two cities hold few secrets from you.' };
  if (percentage >= 50) return { title: 'Seeker of Knowledge', note: 'A good beginning — explore the timeline and try again.' };
  return { title: 'Traveler at the Start of the Path', note: 'Every scholar began here. Read the Two Eras section and return.' };
}

function Badge({ icon: Icon, label, value, accent }: { icon: typeof Award; label: string; value: string; accent: string }) {
  return (
    <div className="card-surface flex flex-1 flex-col items-center rounded-xl px-6 py-5">
      <Icon className={`h-6 w-6 ${accent}`} />
      <p className="mt-2 font-serif text-3xl font-semibold text-charcoal-900">{value}</p>
      <p className="text-xs uppercase tracking-[0.15em] text-charcoal-400">{label}</p>
    </div>
  );
}

export function Quiz() {
  const [stage, setStage] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [shake, setShake] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    setLeaderboard(loadLeaderboard());
  }, []);

  const question = questions[current];
  const progress = questions.length ? ((current + (selected !== null ? 1 : 0)) / questions.length) * 100 : 0;

  const startQuiz = () => {
    setQuestions(buildQuiz(12));
    setCurrent(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setSubmitted(false);
    setStage('playing');
  };

  const answer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setStage('finished');
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const rank = useMemo(() => rankTitle(percentage), [percentage]);

  const submitScore = () => {
    const name = playerName.trim().slice(0, 30);
    if (!name || submitted) return;
    setSubmitted(true);
    const row: LeaderboardRow = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      player_name: name,
      score,
      total: questions.length,
      best_streak: bestStreak,
      created_at: new Date().toISOString(),
    };
    const updated = [...loadLeaderboard(), row]
      .sort((a, b) => b.score - a.score || b.best_streak - a.best_streak)
      .slice(0, 8);
    saveLeaderboard(updated);
    setLeaderboard(updated);
  };

  const clearLeaderboard = () => {
    saveLeaderboard([]);
    setLeaderboard([]);
  };

  return (
    <div>
      <div className="mx-auto max-w-4xl px-5">
        {stage === 'intro' && (
          <div className="card-surface-elevated animate-fade-up rounded-2xl p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-sage-100">
              <Trophy className="h-7 w-7 text-sage-600" />
            </div>
            <h3 className="mt-6 font-serif text-3xl font-semibold text-charcoal-900">Ready to begin?</h3>
            <p className="mx-auto mt-3 max-w-md text-charcoal-500">
              Twelve questions on the Makkan and Madinan surahs. Build a streak, earn your rank, and
              claim a place on the leaderboard.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-charcoal-400">
              Most questions ask you to identify where a surah was revealed. Streaks earn bonus glory.
            </p>
            <button
              onClick={startQuiz}
              className="mt-8 rounded-lg bg-sage-600 px-10 py-3.5 font-medium text-white transition hover:bg-sage-700 hover:shadow-md"
            >
              Start the Challenge
            </button>
          </div>
        )}

        {stage === 'playing' && question && (
          <div className="card-surface-elevated animate-fade-up rounded-2xl p-6 md:p-10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-500">
                Question <span className="font-semibold text-sage-700">{current + 1}</span> of {questions.length}
              </span>
              <span className="flex items-center gap-1.5 text-sage-600">
                <Flame className={`h-4 w-4 ${streak >= 3 ? 'text-orange-500' : ''}`} />
                {streak} streak · {score} correct
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ivory-200">
              <div className="h-full rounded-full bg-sage-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <h3
              key={question.id}
              className={`mt-8 animate-fade-up text-center font-serif text-2xl leading-snug text-charcoal-900 md:text-3xl ${
                shake ? 'animate-pulse' : ''
              }`}
            >
              {question.prompt}
            </h3>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {question.options.map((option, i) => {
                const isCorrect = i === question.correctIndex;
                const isChosen = selected === i;
                let cls = 'border-charcoal-200 hover:border-sage-400 hover:bg-sage-50 hover:-translate-y-0.5';
                if (selected !== null) {
                  if (isCorrect) cls = 'border-sage-500 bg-sage-50';
                  else if (isChosen) cls = 'border-red-400/70 bg-red-50';
                  else cls = 'border-charcoal-200/50 opacity-50';
                }
                return (
                  <button
                    key={option}
                    onClick={() => answer(i)}
                    disabled={selected !== null}
                    className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left font-medium text-charcoal-800 transition-all duration-300 ${cls}`}
                  >
                    {option}
                    {selected !== null && isCorrect && <Check className="h-5 w-5 text-sage-600" />}
                    {selected !== null && isChosen && !isCorrect && <X className="h-5 w-5 text-red-500" />}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div className="mt-6 animate-fade-up rounded-xl border border-sage-200 bg-sage-50/50 p-5 text-sm leading-relaxed text-charcoal-700">
                {question.explanation}
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={next}
                disabled={selected === null}
                className="rounded-lg bg-sage-600 px-10 py-3.5 font-medium text-white transition hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
              </button>
            </div>
          </div>
        )}

        {stage === 'finished' && (
          <div className="animate-fade-up">
            <div className="card-surface-elevated rounded-2xl p-8 text-center md:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-sand-100">
                <Crown className="h-7 w-7 text-sand-500" />
              </div>
              <h3 className="mt-5 font-serif text-3xl font-semibold text-charcoal-900">{rank.title}</h3>
              <p className="mt-2 text-charcoal-500">{rank.note}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Badge icon={Trophy} label="Score" value={`${score}/${questions.length}`} accent="text-sage-600" />
                <Badge icon={Zap} label="Best Streak" value={String(bestStreak)} accent="text-orange-500" />
                <Badge icon={Award} label="Accuracy" value={`${percentage}%`} accent="text-sage-600" />
              </div>

              {!submitted ? (
                <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                  <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={30}
                    placeholder="Your name for the leaderboard"
                    className="flex-1 rounded-lg border border-charcoal-200 bg-white px-5 py-3 text-charcoal-800 placeholder:text-charcoal-300 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                  />
                  <button
                    onClick={submitScore}
                    disabled={!playerName.trim()}
                    className="rounded-lg bg-sage-600 px-6 py-3 font-medium text-white transition hover:bg-sage-700 disabled:opacity-30"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <p className="mt-8 text-sm font-medium text-sage-600">
                  Saved to the leaderboard — well done, {playerName.trim()}!
                </p>
              )}

              <button
                onClick={startQuiz}
                className="mt-8 inline-flex items-center gap-2 rounded-lg border border-sage-300 px-8 py-3 text-sage-700 transition hover:bg-sage-50"
              >
                <RotateCcw className="h-4 w-4" /> Play Again
              </button>
            </div>
          </div>
        )}

        <div className="mt-10">
          <div className="flex items-center justify-center gap-3">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
              <Trophy className="h-4 w-4 text-sage-500" /> Leaderboard
            </h3>
            {leaderboard.length > 0 && (
              <button
                onClick={clearLeaderboard}
                className="flex items-center gap-1 rounded-full border border-charcoal-200 px-3 py-1 text-xs text-charcoal-400 transition hover:border-red-300 hover:text-red-500"
                title="Clear saved scores"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          {leaderboard.length === 0 ? (
            <p className="mt-4 text-center text-sm text-charcoal-400">
              No scores yet — be the first to claim the top spot.
            </p>
          ) : (
            <div className="mx-auto mt-5 max-w-xl space-y-2">
              {leaderboard.map((row, i) => (
                <div
                  key={row.id}
                  className={`card-surface flex items-center gap-4 rounded-xl px-5 py-3.5 ${
                    i === 0 ? 'border-sand-300' : ''
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif font-semibold ${
                      i === 0 ? 'bg-sand-400 text-white' : i === 1 ? 'bg-charcoal-200 text-charcoal-700' : i === 2 ? 'bg-bronze-300/50 text-bronze-500' : 'bg-ivory-200 text-charcoal-500'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate font-medium text-charcoal-800">{row.player_name}</span>
                  <span className="flex items-center gap-1 text-xs text-charcoal-400">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    {row.best_streak}
                  </span>
                  <span className="font-serif text-lg font-semibold text-sage-700">
                    {row.score}/{row.total}
                  </span>
                </div>
              ))}
              <p className="pt-2 text-center text-xs text-charcoal-400">
                Scores are saved on this device only.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
