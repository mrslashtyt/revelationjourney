import { SURAHS } from './surahs';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuiz(count = 12): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const famous = SURAHS.filter((s) =>
    ['Al-Fatihah', 'Al-Baqarah', 'Yusuf', 'Maryam', 'Al-Kahf', 'Ya-Sin', 'Ar-Rahman', 'Al-Mulk', 'An-Nas', 'Al-Falaq', 'At-Tawbah', 'Al-Fath', 'An-Nur', 'Yasin'].includes(s.nameEn) || s.number <= 10
  );
  const pool = shuffle(famous.length >= count ? famous : SURAHS);

  for (const surah of pool.slice(0, count)) {
    const makkanFirst = SURAHS.filter((s) => s.era === 'Makkan');
    const madinanFirst = SURAHS.filter((s) => s.era === 'Madinan');
    const isEraQuestion = Math.random() < 0.7;

    if (isEraQuestion) {
      const options = shuffle(['Makkah', 'Madinah']);
      questions.push({
        id: `era-${surah.number}`,
        prompt: `In which city was Surah ${surah.nameEn} (${surah.nameAr}) revealed?`,
        options,
        correctIndex: options.indexOf(surah.era),
        explanation: `Surah ${surah.nameEn} is a ${surah.era} surah. ${surah.summary.split('.')[0]}.`,
      });
    } else {
      const themesPool = shuffle(surah.themes);
      const theme = themesPool[0];
      const otherEra = surah.era === 'Makkan' ? 'Madinan' : 'Makkan';
      const distractors = shuffle(otherEra === 'Makkan' ? makkanFirst : madinanFirst)
        .filter((s) => s.number !== surah.number && !s.themes.includes(theme))
        .slice(0, 3)
        .map((s) => s.nameEn);
      if (distractors.length < 3) continue;
      questions.push({
        id: `theme-${surah.number}`,
        prompt: `Which surah is associated with the theme of "${theme}"?`,
        options: shuffle([surah.nameEn, ...distractors]),
        correctIndex: -1,
        explanation: `Surah ${surah.nameEn} (${surah.era}) carries this theme. ${surah.summary.split('.')[0]}.`,
      });
      const q = questions[questions.length - 1];
      q.correctIndex = q.options.indexOf(surah.nameEn);
    }
  }
  return questions.slice(0, count);
}

export const DID_YOU_KNOW: string[] = [
  'The Quran was revealed over approximately 23 years — 13 years in Makkah and 10 in Madinah.',
  'Surah Al-Alaq contains the very first verses revealed: "Read, in the name of your Lord who created."',
  'Makkan surahs tend to be shorter and focus on faith, while Madinan surahs are longer and build a community-s laws.',
  'Surah At-Tawbah is the only surah that does not begin with the Basmalah.',
  'Surah An-Nasr was revealed during the Farewell Pilgrimage — a sign that the Prophet-s mission was complete.',
  'About 86 of the 114 surahs were revealed in Makkah, yet Madinan surahs contain most of the verses.',
  'Surah Yusuf was revealed in the "Year of Sorrow" to comfort the Prophet with the story of patience and forgiveness.',
  'The Night of Decree (Laylat al-Qadr), when the Quran began to descend, is described in Surah Al-Qadr as "better than a thousand months".',
  'Surah Ya-Sin is known as "the heart of the Quran" for its powerful focus on resurrection and divine signs.',
  'The shortest surah, Al-Kawthar, has only 3 verses — the longest, Al-Baqarah, has 286.',
];
