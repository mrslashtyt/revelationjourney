import { useEffect, useState } from 'react';

export function Loader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18;
        return next >= 100 ? 100 : next;
      });
    }, 90);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setDone(true), 450);
      return () => clearTimeout(t);
    }
  }, [progress]);

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night-950 transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow">
          <g fill="none" stroke="#e9c56a" strokeWidth="1.2">
            <path d="M50 4l13 13h18v18l13 13-13 13v18H63l-13 13-13-13H19V61L6 48l13-13V17h18z" strokeOpacity="0.9" />
            <path d="M50 22l8 8h11v11l8 8-8 8v11H58l-8 8-8-8H31V57l-8-8 8-8V30h11z" strokeOpacity="0.6" />
            <circle cx="50" cy="50" r="10" strokeOpacity="0.8" />
          </g>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-arabic text-3xl text-gold-400">قرآن</span>
      </div>
      <p className="mt-8 font-heading text-xl tracking-[0.3em] text-gold-300 uppercase">The Two Eras</p>
      <div className="mt-6 h-px w-48 overflow-hidden bg-night-700">
        <div
          className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
