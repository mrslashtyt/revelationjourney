import { ChevronDown } from 'lucide-react';
import { MosqueSilhouette, Stars } from './Decor';
import { OrnamentDivider } from './Decor';

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-night-950 via-night-900 to-night-950" />
      <Stars count={70} />
      <div className="absolute inset-0 geometric-pattern opacity-60" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="animate-fade-up font-arabic text-2xl text-gold-400/90 md:text-3xl" style={{ animationDelay: '0.2s' }}>
          وَقُرْآنًا فَرَقْنَاهُ لِتَقْرَأَهُ عَلَى النَّاسِ عَلَىٰ مُكْثٍ
        </p>
        <p className="mt-2 animate-fade-up text-sm italic text-cream/60" style={{ animationDelay: '0.35s' }}>
          "And it is a Quran which We have divided, that you may recite it to the people over a prolonged period."
          — Al-Isra 17:106
        </p>

        <h1
          className="mt-10 animate-fade-up font-heading text-5xl font-semibold leading-[1.15] text-cream md:text-7xl"
          style={{ animationDelay: '0.5s' }}
        >
          The Two Eras of
          <span className="mt-2 block gold-shimmer animate-shimmer text-glow-gold">Revelation</span>
        </h1>

        <OrnamentDivider className="mt-8 animate-fade-up" />

        <p
          className="mx-auto mt-8 max-w-2xl animate-fade-up text-base leading-relaxed text-cream/75 md:text-lg"
          style={{ animationDelay: '0.7s' }}
        >
          Journey through twenty-three years of divine revelation — from the cave of Hira in Makkah
          to the flourishing community of Madinah — and discover how the place and moment of each
          surah shaped its message.
        </p>

        <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '0.9s' }}>
          <a
            href="#eras"
            className="group rounded-full bg-gradient-to-r from-gold-600 to-gold-400 px-8 py-3.5 font-medium text-night-950 shadow-[0_0_24px_rgba(233,197,106,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(233,197,106,0.55)]"
          >
            Begin the Journey
          </a>
          <a
            href="#quiz"
            className="rounded-full border border-gold-500/40 px-8 py-3.5 font-medium text-gold-300 transition-all duration-300 hover:bg-gold-500/10 hover:border-gold-400"
          >
            Test Your Knowledge
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[5]">
        <MosqueSilhouette />
      </div>

      <a
        href="#eras"
        className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 animate-float text-gold-400/80 transition hover:text-gold-300"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-7 w-7" />
      </a>
    </section>
  );
}
