export interface VerseReflection {
  arabic: string;
  translation: string;
  reference: string;
  surahNumber: number;
  era: 'Makkan' | 'Madinan';
  reflection: string;
}

export const VERSES: VerseReflection[] = [
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship comes ease.',
    reference: 'Ash-Sharh 94:5',
    surahNumber: 94,
    era: 'Makkan',
    reflection:
      'Revealed in Makkah amid persecution, this short verse repeats the ease twice for the single hardship — a promise that relief is built into the trial itself.',
  },
  {
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • وَاحِسَبْ أَنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    translation: 'So be patient — indeed, the promise of Allah is truth.',
    reference: 'Ar-Rum 30:60',
    surahNumber: 30,
    era: 'Makkan',
    reflection:
      'The Makkan believers faced boycotts and exile. This command paired patience with certainty: the promise is not maybe — it is truth.',
  },
  {
    arabic: 'وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا',
    translation: 'And hold firmly to the rope of Allah all together and do not become divided.',
    reference: 'Ali Imran 3:103',
    surahNumber: 3,
    era: 'Madinan',
    reflection:
      'A Madinan verse for a young society: once faith had been planted in Makkah, Madinah taught how a community holds together.',
  },
  {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translation: 'And whoever fears Allah — He will make for him a way out.',
    reference: 'At-Talaq 65:2',
    surahNumber: 65,
    era: 'Madinan',
    reflection:
      'From the Madinan surah of divorce and provision — a reminder that every dead end carries a door for the one who holds to consciousness of Allah.',
  },
  {
    arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    translation: 'Read, in the name of your Lord who created.',
    reference: 'Al-Alaq 96:1',
    surahNumber: 96,
    era: 'Makkan',
    reflection:
      'The very first words of revelation, delivered in the cave of Hira — the mission of twenty-three years began with a command to read.',
  },
  {
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: 'And say: My Lord, increase me in knowledge.',
    reference: 'Ta-Ha 20:114',
    surahNumber: 20,
    era: 'Makkan',
    reflection:
      'The surah that moved Umar to Islam carries this prayer — knowledge in this religion is never finished, only grown.',
  },
  {
    arabic: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ',
    translation: 'And cooperate with one another in righteousness and piety.',
    reference: 'Al-Ma-idah 5:2',
    surahNumber: 5,
    era: 'Madinan',
    reflection:
      'Among the final surahs revealed, addressed to a settled community: faith in Madinah became a shared project, not a private struggle.',
  },
  {
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: 'Verily, in the remembrance of Allah do hearts find rest.',
    reference: 'Ar-Rad 13:28',
    surahNumber: 13,
    era: 'Madinan',
    reflection:
      'A rare Madinan verse of inner peace — the outward laws of the community were always paired with the stillness of the heart.',
  },
];
