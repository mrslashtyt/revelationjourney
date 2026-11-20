import { useState } from 'react';
import { Sparkles, Timer, Zap } from 'lucide-react';
import { OrnamentDivider } from './Decor';
import { Quiz } from './Quiz';
import { MatchGame } from './MatchGame';

export function QuizPage() {
  const [gameOpen, setGameOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory-50 animate-fade-in">
      <div className="mx-auto max-w-4xl px-5 py-12 md:py-20">
        <div className="text-center">
          <p className="font-arabic text-lg text-sage-500">اختبر معرفتك</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 md:text-5xl">Quiz & Games</h1>
          <OrnamentDivider className="mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-charcoal-500">
            Test your knowledge of the Makkan and Madinan surahs. Build streaks, earn rank titles, and claim your place on the leaderboard.
          </p>
        </div>

        {/* Game selection */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="card-surface-elevated rounded-2xl p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sage-100">
              <Sparkles className="h-5 w-5 text-sage-600" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold text-charcoal-900">The Revelation Challenge</h3>
            <p className="mt-2 text-sm text-charcoal-500">
              Twelve questions on where and when surahs were revealed. Earn rank titles from "Traveler" to "Hafiz of the Two Eras".
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-sage-50 px-3 py-1 text-sage-700">12 questions</span>
              <span className="rounded-full bg-sage-50 px-3 py-1 text-sage-700">Streak bonuses</span>
              <span className="rounded-full bg-sage-50 px-3 py-1 text-sage-700">Leaderboard</span>
            </div>
            <a href="#quiz-section" className="mt-5 inline-block text-sm font-medium text-sage-600 hover:text-sage-700">
              Start below ↓
            </a>
          </div>

          <div className="card-surface-elevated rounded-2xl p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sand-100">
              <Zap className="h-5 w-5 text-sand-500" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold text-charcoal-900">Match the Surah</h3>
            <p className="mt-2 text-sm text-charcoal-500">
              60 seconds, endless surahs. Sort each card into Makkah or Madinah. Every 3 in a row builds a combo worth more points.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-sand-50 px-3 py-1 text-sand-600">60 seconds</span>
              <span className="rounded-full bg-sand-50 px-3 py-1 text-sand-600">Combo multipliers</span>
              <span className="rounded-full bg-sand-50 px-3 py-1 text-sand-600">Keyboard: ← →</span>
            </div>
            <button
              onClick={() => setGameOpen(true)}
              className="mt-5 rounded-lg bg-sand-400 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sand-500"
            >
              Play Match Game
            </button>
          </div>
        </div>

        {/* Quiz section */}
        <div id="quiz-section" className="mt-16">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100">
              <Timer className="h-6 w-6 text-sage-600" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-charcoal-900">The Revelation Challenge</h2>
          </div>
          <Quiz />
        </div>
      </div>

      {gameOpen && <MatchGame onClose={() => setGameOpen(false)} />}
    </div>
  );
}
