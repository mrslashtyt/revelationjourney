export function OrnamentDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/60" />
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-400" fill="currentColor">
        <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/60" />
    </div>
  );
}

export function Stars({ count = 40 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => {
    const seed = (i * 2654435761) % 100000;
    const top = (seed % 100);
    const left = ((seed * 7) % 100);
    const size = (seed % 3) + 1;
    const delay = (seed % 30) / 10;
    return { top, left, size, delay, key: i };
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {stars.map((s) => (
        <span
          key={s.key}
          className="absolute rounded-full bg-gold-200 animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function MosqueSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 220"
      preserveAspectRatio="xMidYMax slice"
      className={`w-full ${className}`}
      aria-hidden
    >
      <g fill="#04120d">
        <path d="M0 220V160h40v-20h14v20h60v-40h12v-16h8v16h12v40h90v-70h20v-24c0-8 8-14 16-14s16 6 16 14v24h20v70h120v-50h16v-20h10v20h16v50h80v-90c0-60 60-90 60-90s60 30 60 90v90h80v-50h16v-20h10v20h16v50h120v-70h20v-24c0-8 8-14 16-14s16 6 16 14v24h20v70h90v-40h12v-16h8v16h12v40h60v-20h14v20h40v60z" />
      </g>
      <g fill="#0e3a2e">
        <circle cx="540" cy="42" r="4" fill="#e9c56a" opacity="0.8" />
        <circle cx="900" cy="42" r="4" fill="#e9c56a" opacity="0.8" />
        <rect x="536" y="50" width="8" height="18" rx="4" />
        <rect x="896" y="50" width="8" height="18" rx="4" />
      </g>
    </svg>
  );
}
