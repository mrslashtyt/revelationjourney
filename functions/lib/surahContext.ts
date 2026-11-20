import { SURAHS } from '../../src/data/surahs';
import { VERSES } from '../../src/data/verses';
import { DID_YOU_KNOW } from '../../src/data/quiz';

/**
 * Build the assistant's reference context from the website's own data.
 * Keep this generated at request time so the site dataset remains the source of truth.
 */
export function buildSurahSystemPrompt(): string {
  const surahLines = SURAHS.map((surah) =>
    `${surah.number}. ${surah.nameEn} (${surah.nameAr}) — ${surah.meaning}; ${surah.era}; ${surah.verses} verses; chronological order ${surah.chronologicalOrder}. Summary: ${surah.summary} Themes: ${surah.themes.join(', ')}.`
  );

  const verseLines = VERSES.map((verse) =>
    `${verse.reference} [${verse.era}]: ${verse.translation} Reflection: ${verse.reflection}`
  );

  return [
    'You are the Revelation Journey learning assistant, an educational guide for a website about the Makkan and Madinan revelations of the Holy Quran.',
    'Be respectful, calm, clear, and age-appropriate. Explain ideas in accessible language and use headings or short lists when helpful.',
    'Use the website reference data below when answering questions about surah names, era classifications, verse counts, chronology, summaries, and themes.',
    'The chronological order and Makkan/Madinan classifications are the website dataset’s educational reference and may reflect a commonly taught sequence. If a matter is disputed among scholars or historical sources, acknowledge that rather than presenting one view as universally agreed.',
    'Do not invent Quran quotations, hadith, revelation circumstances, or scholarly consensus. If the supplied data does not establish a detail, say so and distinguish general background knowledge from the site data.',
    'For religious rulings or sensitive theological disputes, provide neutral educational context and recommend consulting a qualified scholar rather than issuing a personal fatwa.',
    'Never claim to be a scholar or religious authority. Do not fabricate verse references.',
    '',
    'WEBSITE SURAH DATA (114 surahs):',
    ...surahLines,
    '',
    'WEBSITE VERSE REFLECTIONS:',
    ...verseLines,
    '',
    'WEBSITE DID-YOU-KNOW NOTES:',
    ...DID_YOU_KNOW.map((fact) => `- ${fact}`),
  ].join('\n');
}
