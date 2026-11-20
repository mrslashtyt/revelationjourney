export function OrnamentDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-sage-300" />
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-sand-400" fill="currentColor">
        <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-sage-300" />
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
      <g fill="#a3c0a3" fillOpacity="0.08">
        <path d="M0 220V160h40v-20h14v20h60v-40h12v-16h8v16h12v40h90v-70h20v-24c0-8 8-14 16-14s16 6 16 14v24h20v70h120v-50h16v-20h10v20h16v50h80v-90c0-60 60-90 60-90s60 30 60 90v90h80v-50h16v-20h10v20h16v50h120v-70h20v-24c0-8 8-14 16-14s16 6 16 14v24h20v70h90v-40h12v-16h8v16h12v40h60v-20h14v20h40v60z" />
      </g>
      <g fill="#c9a877" fillOpacity="0.15">
        <circle cx="540" cy="42" r="4" />
        <circle cx="900" cy="42" r="4" />
        <rect x="536" y="50" width="8" height="18" rx="4" />
        <rect x="896" y="50" width="8" height="18" rx="4" />
      </g>
    </svg>
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
          className="absolute rounded-full bg-sand-300/40 animate-pulse-soft"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}
