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
    // storage unavailable — leaderboard simply is not persisted
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
    <div className="card-surface flex flex-1 flex-col items-center rounded-2xl px-6 py-5">
      <Icon className={`h-6 w-6 ${accent}`} />
      <p className="mt-2 font-heading text-3xl font-semibold text-cream">{value}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-cream/50">{label}</p>
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
    <section id="quiz" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 geometric-pattern opacity-30" />
      <div className="relative mx-auto max-w-4xl px-5">
        <div className="text-center">
          <p className="font-arabic text-xl text-gold-400">اختبر معرفتك</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-cream md:text-5xl">
            The Revelation Challenge
          </h2>
          <OrnamentDivider className="mt-6" />
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-cream/70">
            Twelve questions on the Makkan and Madinan surahs. Build a streak, earn your rank, and
            claim a place on the leaderboard.
          </p>
        </div>

        <div className="mt-12">
          {stage === 'intro' && (
            <div className="card-surface animate-fade-up rounded-3xl p-10 text-center">
              <Trophy className="mx-auto h-14 w-14 text-gold-400 animate-pulse-glow rounded-full p-2.5" />
              <h3 className="mt-6 font-heading text-3xl text-cream">Ready to begin?</h3>
              <p className="mx-auto mt-3 max-w-md text-cream/65">
                Most questions ask you to identify where a surah was revealed. Streaks earn bonus
                glory on the leaderboard.
              </p>
              <button
                onClick={startQuiz}
                className="mt-8 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 px-10 py-4 font-medium text-night-950 shadow-[0_0_24px_rgba(233,197,106,0.35)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(233,197,106,0.55)]"
              >
                Start the Challenge
              </button>
            </div>
          )}

          {stage === 'playing' && question && (
            <div className="card-surface animate-fade-up rounded-3xl p-8 md:p-10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cream/60">
                  Question <span className="font-semibold text-gold-300">{current + 1}</span> of {questions.length}
                </span>
                <span className="flex items-center gap-1.5 text-gold-300">
                  <Flame className={`h-4 w-4 ${streak >= 3 ? 'animate-pulse text-orange-400' : ''}`} />
                  {streak} streak · {score} correct
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-night-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-gold-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <h3
                key={question.id}
                className={`mt-8 animate-fade-up text-center font-heading text-2xl leading-snug text-cream md:text-3xl ${
                  shake ? 'animate-[pulseGlow_0.15s_ease-in-out_3]' : ''
                }`}
              >
                {question.prompt}
              </h3>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {question.options.map((option, i) => {
                  const isCorrect = i === question.correctIndex;
                  const isChosen = selected === i;
                  let cls = 'border-cream/15 hover:border-gold-400/60 hover:bg-gold-500/10 hover:-translate-y-0.5';
                  if (selected !== null) {
                    if (isCorrect) cls = 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_20px_rgba(52,211,153,0.25)]';
                    else if (isChosen) cls = 'border-red-400/70 bg-red-500/10';
                    else cls = 'border-cream/10 opacity-50';
                  }
                  return (
                    <button
                      key={option}
                      onClick={() => answer(i)}
                      disabled={selected !== null}
                      className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left font-medium text-cream transition-all duration-300 ${cls}`}
                    >
                      {option}
                      {selected !== null && isCorrect && <Check className="h-5 w-5 text-emerald-400" />}
                      {selected !== null && isChosen && !isCorrect && <X className="h-5 w-5 text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="mt-6 animate-fade-up rounded-2xl border border-gold-500/20 bg-gold-500/5 p-5 text-sm leading-relaxed text-cream/80">
                  {question.explanation}
                </div>
              )}

              <div className="mt-8 text-center">
                <button
                  onClick={next}
                  disabled={selected === null}
                  className="rounded-full bg-gradient-to-r from-gold-600 to-gold-400 px-10 py-3.5 font-medium text-night-950 transition-all duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
                </button>
              </div>
            </div>
          )}

          {stage === 'finished' && (
            <div className="animate-fade-up">
              <div className="card-surface rounded-3xl p-8 text-center md:p-12">
                <Crown className="mx-auto h-14 w-14 text-gold-400" />
                <h3 className="mt-5 font-heading text-3xl text-cream">{rank.title}</h3>
                <p className="mt-2 text-cream/60">{rank.note}</p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Badge icon={Trophy} label="Score" value={`${score}/${questions.length}`} accent="text-gold-300" />
                  <Badge icon={Zap} label="Best Streak" value={String(bestStreak)} accent="text-orange-400" />
                  <Badge icon={Award} label="Accuracy" value={`${percentage}%`} accent="text-emerald-400" />
                </div>

                {!submitted ? (
                  <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                    <input
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      maxLength={30}
                      placeholder="Your name for the leaderboard"
                      className="flex-1 rounded-full border border-gold-500/25 bg-night-900/80 px-5 py-3 text-cream placeholder:text-cream/35 outline-none focus:border-gold-400/60"
                    />
                    <button
                      onClick={submitScore}
                      disabled={!playerName.trim()}
                      className="rounded-full bg-gradient-to-r from-gold-600 to-gold-400 px-6 py-3 font-medium text-night-950 transition hover:scale-[1.03] disabled:opacity-30"
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <p className="mt-8 text-sm font-medium text-emerald-300">
                    Saved to the leaderboard — well done, {playerName.trim()}!
                  </p>
                )}

                <button
                  onClick={startQuiz}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold-500/40 px-8 py-3 text-gold-300 transition hover:bg-gold-500/10"
                >
                  <RotateCcw className="h-4 w-4" /> Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-center gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
              <Trophy className="h-4 w-4" /> Leaderboard
            </h3>
            {leaderboard.length > 0 && (
              <button
                onClick={clearLeaderboard}
                className="flex items-center gap-1 rounded-full border border-cream/15 px-3 py-1 text-xs text-cream/45 transition hover:border-red-400/40 hover:text-red-300"
                title="Clear saved scores"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          {leaderboard.length === 0 ? (
            <p className="mt-4 text-center text-sm text-cream/50">
              No scores yet — be the first to claim the top spot.
            </p>
          ) : (
            <div className="mx-auto mt-5 max-w-xl space-y-2">
              {leaderboard.map((row, i) => (
                <div
                  key={row.id}
                  className={`card-surface flex items-center gap-4 rounded-2xl px-5 py-3.5 ${
                    i === 0 ? 'border-gold-400/50 shadow-[0_0_24px_rgba(233,197,106,0.18)]' : ''
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading font-semibold ${
                      i === 0 ? 'bg-gold-400 text-night-950' : i === 1 ? 'bg-cream/25 text-cream' : i === 2 ? 'bg-gold-600/40 text-gold-200' : 'bg-cream/10 text-cream/60'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate font-medium text-cream">{row.player_name}</span>
                  <span className="flex items-center gap-1 text-xs text-cream/50">
                    <Flame className="h-3.5 w-3.5 text-orange-400" />
                    {row.best_streak}
                  </span>
                  <span className="font-heading text-lg text-gold-300">
                    {row.score}/{row.total}
                  </span>
                </div>
              ))}
              <p className="pt-2 text-center text-xs text-cream/35">
                Scores are saved on this device only.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
