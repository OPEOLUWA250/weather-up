import { Phrases } from './phrases';

// Yorùbá. Please have a native speaker review these before relying on them.
export const yo: Phrases = {
  cardTitle: 'Ní èdè tó rọrùn',
  readAloud: 'Kà á sókè',
  stop: 'Dúró',

  feel: {
    veryHot: 'gbóná gidigidi',
    hot: 'gbóná',
    warm: 'gbóná díẹ̀',
    mild: 'dára',
    cool: 'tutù díẹ̀',
    cold: 'tutù',
    freezing: 'tutù gidigidi',
  },
  condition: {
    clear: 'ojú ọ̀run mọ́',
    cloudy: 'ìkùukùu bo ojú ọ̀run',
    fog: 'kùrukùru bo ìlú',
    drizzle: 'òjò wínníwínní ń rọ̀',
    rain: 'òjò ń rọ̀',
    snow: 'yìnyín ń bọ́',
    storm: 'ìjì ń jà',
  },

  now: (feel, temp, condition) => `Ní báyìí, ojú ọjọ́ ${feel}: ${temp}, ${condition}.`,
  feelsHotter: (temp, humid) =>
    humid
      ? `Ṣùgbọ́n ara yóò mọ̀ ọ́ bí ${temp}, nítorí pé ọ̀rinrin pọ̀ nínú afẹ́fẹ́.`
      : `Ṣùgbọ́n ara yóò mọ̀ ọ́ bí ${temp}.`,
  feelsColder: (temp) => `Ṣùgbọ́n ara yóò mọ̀ ọ́ bí ${temp}, nítorí afẹ́fẹ́.`,

  rightNow: 'ní báyìí',
  around: (time) => `ní nǹkan bí ${time}`,
  storm: (when) => `Ìjì àti àrá lè wáyé ${when}. Dúró sínú ilé tí o bá lè ṣe é.`,
  snow: (when) => `Yìnyín lè bọ́ ${when}. Wọ aṣọ tó nípọn.`,
  rain: (when) => `Òjò lè rọ̀ ${when}. Mú agboòrùn dání.`,
  noRain: 'A kò retí òjò láàárín wákàtí méjìlá tó ń bọ̀.',

  todayRange: (high, low) => `Lónìí, ooru yóò dé ${high}, yóò sì lọ sílẹ̀ dé ${low}.`,
  veryWindy: 'Afẹ́fẹ́ ń fẹ́ gidigidi. Ṣọ́ra níta.',
  windy: 'Afẹ́fẹ́ ń fẹ́ díẹ̀.',
  heatAdvice: 'Mu omi púpọ̀, kí o sì dúró sí ibòji.',
  coldAdvice: 'Wọ aṣọ òtútù.',
  strongSun: 'Oòrùn mú gan-an lónìí. Dé fìlà tàbí lo ìpara oòrùn.',
  airUnhealthy: 'Afẹ́fẹ́ kò dára lónìí. Má ṣe pẹ́ níta.',
  airPoor: 'Afẹ́fẹ́ kò mọ́ tó. Àwọn tó ní àrùn asthma kí wọ́n ṣọ́ra.',

  weekDry: 'Òjò kò ní rọ̀ ní ọ̀sẹ̀ yìí.',
  weekMostlyRain: 'Òjò yóò rọ̀ ní ọ̀pọ̀ ọjọ́ ọ̀sẹ̀ yìí.',
  weekSomeRain: (days) => `Òjò lè rọ̀ ní ọjọ́ ${days} nínú ọjọ́ méje tó ń bọ̀.`,

  morningTitle: (city) => `Ẹ káàárọ̀! Ojú ọjọ́ ${city}`,
  morningBody: (low, high, rainChance) =>
    rainChance >= 50
      ? `Lónìí: ${low} sí ${high}. Òjò lè rọ̀ (${rainChance}%). Mú agboòrùn dání.`
      : `Lónìí: ${low} sí ${high}. A kò retí òjò.`,
};
