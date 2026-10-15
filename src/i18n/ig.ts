import { Phrases } from './phrases';

// Igbo. Please have a native speaker review these before relying on them.
export const ig: Phrases = {
  cardTitle: "N'okwu dị mfe",
  readAloud: 'Gụpụta ya',
  stop: 'Kwụsị',

  feel: {
    veryHot: 'na-ekpo ọkụ nke ukwuu',
    hot: 'na-ekpo ọkụ',
    warm: 'na-ekpo ọkụ ntakịrị',
    mild: 'dị mma',
    cool: 'dị jụụ ntakịrị',
    cold: 'dị oyi',
    freezing: 'dị oyi nke ukwuu',
  },
  condition: {
    clear: 'mbara igwe dị ọcha',
    cloudy: 'igwe ojii kpuchiri mbara igwe',
    fog: 'alụlụ kpuchiri ebe niile',
    drizzle: 'mmiri ozuzo nta na-ezo',
    rain: 'mmiri ozuzo na-ezo',
    snow: 'snow na-ada',
    storm: 'oké mmiri na-ezo',
  },

  now: (feel, temp, condition) => `Ugbu a, ihu igwe ${feel}: ${temp}, ${condition}.`,
  feelsHotter: (temp, humid) =>
    humid
      ? `Mana ọ ga-adị gị ka ${temp}, n'ihi na ikuku nwere mmiri nke ukwuu.`
      : `Mana ọ ga-adị gị ka ${temp}.`,
  feelsColder: (temp) => `Mana ọ ga-adị gị ka ${temp}, n'ihi ikuku.`,

  rightNow: 'ugbu a',
  around: (time) => `n'ihe dị ka ${time}`,
  storm: (when) =>
    `Oké mmiri ozuzo na égbè eluigwe nwere ike ịbịa ${when}. Nọrọ n'ụlọ ma ọ bụrụ na ị nwere ike.`,
  snow: (when) => `Snow nwere ike ịda ${when}. Yiri uwe na-ekpo ọkụ.`,
  rain: (when) => `Mmiri ozuzo nwere ike izo ${when}. Buru nche anwụ.`,
  noRain: "Anaghị atụ anya mmiri ozuzo n'ime awa iri na abụọ na-abịa.",

  todayRange: (high, low) => `Taa, okpomọkụ ga-eru ${high}, ma gbadata ruo ${low}.`,
  veryWindy: "Ikuku na-efe nke ukwuu. Kpachara anya n'èzí.",
  windy: 'Ikuku na-efe ntakịrị.',
  heatAdvice: 'Ṅụọ mmiri nke ọma ma nọrọ na ndò.',
  coldAdvice: 'Yiri uwe oyi.',
  strongSun: 'Anwụ siri ike taa. Kpuo okpu ma ọ bụ tee ude anwụ.',
  airUnhealthy: "Ikuku adịghị mma taa. Ebela ogologo oge n'èzí.",
  airPoor: 'Ikuku adịghị ọcha nke ọma. Ndị nwere asthma kpachara anya.',

  weekDry: "Mmiri ozuzo agaghị ezo n'izu a.",
  weekMostlyRain: "Mmiri ozuzo ga-ezo ihe fọrọ nke nta ka ọ bụrụ ụbọchị niile n'izu a.",
  weekSomeRain: (days) => `Mmiri ozuzo nwere ike izo n'ụbọchị ${days} n'ime ụbọchị asaa na-abịa.`,

  morningTitle: (city) => `Ụtụtụ ọma! Ihu igwe ${city}`,
  morningBody: (low, high, rainChance) =>
    rainChance >= 50
      ? `Taa: ${low} ruo ${high}. Mmiri ozuzo nwere ike izo (${rainChance}%). Buru nche anwụ.`
      : `Taa: ${low} ruo ${high}. Anaghị atụ anya mmiri ozuzo.`,
};
