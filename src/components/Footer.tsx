import { OrnamentDivider } from './Decor';

export function Footer() {
  return (
    <footer className="border-t border-charcoal-200/40 bg-ivory-100 py-14">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <p className="font-arabic text-2xl leading-relaxed text-sage-600">
          أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ
        </p>
        <p className="mt-2 text-sm italic text-charcoal-500">
          "Then do they not reflect upon the Quran?" — An-Nisa 4:82
        </p>
        <OrnamentDivider className="mt-8" />
        <p className="mt-6 text-sm text-charcoal-500">
          The Two Eras of Revelation — an interactive study of the Makkan and Madinan surahs.
        </p>
        <p className="mt-1 text-xs text-charcoal-400">
          Chronological ordering follows the widely-taught Egyptian standard sequence; for a small
          number of surahs, scholars differ.
        </p>
      </div>
    </footer>
  );
}
