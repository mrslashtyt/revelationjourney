import { OrnamentDivider } from './Decor';

export function Footer() {
  return (
    <footer className="relative border-t border-gold-500/15 bg-night-950 py-14">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <p className="font-arabic text-2xl leading-relaxed text-gold-300">
          أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ
        </p>
        <p className="mt-2 text-sm italic text-cream/55">
          "Then do they not reflect upon the Quran?" — An-Nisa 4:82
        </p>
        <OrnamentDivider className="mt-8" />
        <p className="mt-6 text-sm text-cream/45">
          The Two Eras of Revelation — an interactive study of the Makkan and Madinan surahs.
        </p>
        <p className="mt-1 text-xs text-cream/30">
          Chronological ordering follows the widely-taught Egyptian standard sequence; for a small
          number of surahs, scholars differ.
        </p>
      </div>
    </footer>
  );
}
