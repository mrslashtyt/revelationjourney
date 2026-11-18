import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Timer, X } from 'lucide-react';
import { SURAHS } from '../data/surahs';

interface FloatText {
  id: number;
  text: string;
  x: number;
  y: number;
  good: boolean;
}

interface SortBinProps {
  label: string;
  arabic: string;
  isMakkah: boolean;
  isHot: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
}

function SortBin({ label, arabic, isMakkah, isHot, onDrop, onDragOver, onDragLeave }: SortBinProps) {
  const base = isMakkah
    ? isHot
      ? 'border-sage-500 bg-sage-50 scale-[1.03]'
      : 'border-sage-300 bg-sage-50/30'
    : isHot
      ? 'border-sand-500 bg-sand-50 scale-[1.03]'
      : 'border-sand-300 bg-sand-50/30';
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`flex min-h-[140px] flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${base}`}
    >
      <span className={`font-arabic text-3xl ${isMakkah ? 'text-sage-600' : 'text-sand-500'}`}>{arabic}</span>
      <span className="mt-1 font-serif text-xl text-charcoal-900">{label}</span>
      <span className="mt-1 text-xs uppercase tracking-[0.15em] text-charcoal-400">Drop here</span>
    </div>
  );
}

const ROUND_TIME = 60;

export function MatchGame({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<'intro' | 'playing' | 'done'>('intro');
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [card, setCard] = useState(() => SURAHS[Math.floor(Math.random() * SURAHS.length)]);
  const [nextCard, setNextCard] = useState(() => SURAHS[Math.floor(Math.random() * SURAHS.length)]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [placed, setPlaced] = useState(0);
  const [floats, setFloats] = useState<FloatText[]>([]);
  const [hotBin, setHotBin] = useState<'makkah' | 'madinah' | null>(null);
  const [draggable, setDraggable] = useState(true);
  const floatId = useRef(0);
  const cardAreaRef = useRef<HTMLDivElement>(null);

  const spawnFloat = useCallback((text: string, good: boolean) => {
    const rect = cardAreaRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 + (Math.random() * 60 - 30) : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const id = ++floatId.current;
    setFloats((f) => [...f, { id, text, x, y, good }]);
    setTimeout(() => setFloats((f) => f.filter((fl) => fl.id !== id)), 1100);
  }, []);

  const drawCard = useCallback(() => {
    setCard(nextCard);
    setNextCard(SURAHS[Math.floor(Math.random() * SURAHS.length)]);
    setPlaced((p) => p + 1);
  }, [nextCard]);

  const judge = useCallback(
    (bin: 'makkah' | 'madinah') => {
      if (!draggable) return;
      setDraggable(false);
      setHotBin(null);
      const correct = (bin === 'makkah') === (card.era === 'Makkan');
      if (correct) {
        const comboMult = 1 + Math.floor(combo / 3) * 0.5;
        const gained = Math.round(100 * comboMult);
        setScore((s) => s + gained);
        setCombo((c) => c + 1);
        spawnFloat(combo >= 2 ? `+${gained}  x${combo + 1} combo!` : `+${gained}`, true);
      } else {
        setCombo(0);
        spawnFloat('Missed', false);
      }
      setTimeout(() => {
        drawCard();
        setDraggable(true);
      }, 350);
    },
    [card, combo, draggable, drawCard, spawnFloat]
  );

  useEffect(() => {
    if (stage !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setStage('done');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (stage !== 'playing' || !draggable) return;
      if (e.key === 'ArrowLeft') judge('makkah');
      if (e.key === 'ArrowRight') judge('madinah');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, judge, draggable]);

  const start = () => {
    setScore(0);
    setCombo(0);
    setPlaced(0);
    setTimeLeft(ROUND_TIME);
    setCard(SURAHS[Math.floor(Math.random() * SURAHS.length)]);
    setNextCard(SURAHS[Math.floor(Math.random() * SURAHS.length)]);
    setDraggable(true);
    setStage('playing');
  };

  const accuracy = placed ? Math.round(((score / 100) / placed) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl md:p-10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-charcoal-400 transition hover:bg-ivory-100 hover:text-charcoal-700"
          aria-label="Close game"
        >
          <X className="h-5 w-5" />
        </button>

        {stage === 'intro' && (
          <div className="animate-fade-up text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-sand-100">
              <Timer className="h-7 w-7 text-sand-500" />
            </div>
            <h3 className="mt-5 font-serif text-3xl font-semibold text-charcoal-900">Match the Surah</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-500">
              60 seconds, endless surahs. Drag each card into the city where it was revealed — or
              tap the buttons. Every 3 in a row builds a combo worth more points.
            </p>
            <div className="mx-auto mt-6 max-w-xs text-left text-xs text-charcoal-400">
              <p><span className="text-sand-500 font-medium">Keyboard:</span> ← Makkah · → Madinah</p>
            </div>
            <button
              onClick={start}
              className="mt-8 rounded-lg bg-sand-400 px-10 py-3.5 font-medium text-white transition hover:bg-sand-500"
            >
              Start the Clock
            </button>
          </div>
        )}

        {stage === 'playing' && (
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-500">
                Score <span className="font-serif text-xl font-semibold text-sage-700">{score}</span>
              </span>
              {combo >= 2 && (
                <motion.span
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600"
                >
                  {combo} combo
                </motion.span>
              )}
              <span className={`flex items-center gap-1.5 font-serif text-xl ${timeLeft <= 10 ? 'text-red-500' : 'text-charcoal-700'}`}>
                <Timer className="h-4 w-4" />
                {timeLeft}s
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivory-200">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${timeLeft <= 10 ? 'bg-red-400' : 'bg-sage-500'}`}
                style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
              />
            </div>

            <div ref={cardAreaRef} className="relative my-8 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={card.number}
                  initial={{ y: -60, opacity: 0, rotate: -3 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 60, opacity: 0, rotate: 3 }}
                  transition={{ duration: 0.3 }}
                  draggable={draggable}
                  onDragStart={(e) => (e as unknown as React.DragEvent).dataTransfer.setData('text/plain', String(card.number))}
                  className={`w-56 cursor-grab select-none rounded-xl border border-charcoal-200 bg-white p-6 text-center shadow-md active:cursor-grabbing ${draggable ? '' : 'opacity-60'}`}
                >
                  <p className="font-arabic text-4xl leading-snug text-sage-600">{card.nameAr}</p>
                  <p className="mt-2 font-serif text-lg font-semibold text-charcoal-900">{card.nameEn}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-charcoal-400">
                    Surah {card.number} · {card.verses} verses
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <SortBin
                label="Makkah"
                arabic="مكية"
                isMakkah
                isHot={hotBin === 'makkah'}
                onDrop={(e) => { e.preventDefault(); judge('makkah'); }}
                onDragOver={(e) => { e.preventDefault(); setHotBin('makkah'); }}
                onDragLeave={() => setHotBin(null)}
              />
              <SortBin
                label="Madinah"
                arabic="مدنية"
                isMakkah={false}
                isHot={hotBin === 'madinah'}
                onDrop={(e) => { e.preventDefault(); judge('madinah'); }}
                onDragOver={(e) => { e.preventDefault(); setHotBin('madinah'); }}
                onDragLeave={() => setHotBin(null)}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
              <button onClick={() => judge('makkah')} className="rounded-lg bg-sage-100 py-3 font-medium text-sage-700">
                Makkah
              </button>
              <button onClick={() => judge('madinah')} className="rounded-lg bg-sand-100 py-3 font-medium text-sand-600">
                Madinah
              </button>
            </div>
          </div>
        )}

        {stage === 'done' && (
          <div className="animate-fade-up text-center">
            <h3 className="font-serif text-3xl font-semibold text-charcoal-900">Time is up!</h3>
            <p className="mt-6 font-serif text-6xl font-semibold text-sage-700">{score}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-charcoal-400">points</p>
            <div className="mx-auto mt-6 flex max-w-sm justify-center gap-3 text-sm text-charcoal-600">
              <span className="card-surface rounded-lg px-4 py-2">{placed} cards sorted</span>
              <span className="card-surface rounded-lg px-4 py-2">{accuracy}% accuracy</span>
            </div>
            <button
              onClick={start}
              className="mt-8 rounded-lg bg-sand-400 px-10 py-3.5 font-medium text-white transition hover:bg-sand-500"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {floats.map((f) => (
        <motion.span
          key={f.id}
          initial={{ opacity: 1, y: 0, scale: 0.8 }}
          animate={{ opacity: 0, y: -70, scale: 1.15 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`pointer-events-none fixed z-[95] font-serif text-xl font-semibold ${f.good ? 'text-sage-600' : 'text-red-500'}`}
          style={{ left: f.x, top: f.y, transform: 'translate(-50%, -50%)' }}
        >
          {f.text}
        </motion.span>
      ))}
    </div>
  );
}
