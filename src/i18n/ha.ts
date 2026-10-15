import { Phrases } from './phrases';

// Hausa. Please have a native speaker review these before relying on them.
export const ha: Phrases = {
  cardTitle: 'A sauƙaƙe',
  readAloud: 'Karanta da ƙarfi',
  stop: 'Tsaya',

  feel: {
    veryHot: 'zafi sosai',
    hot: 'zafi',
    warm: 'ɗan zafi',
    mild: 'yanayi mai daɗi',
    cool: 'ɗan sanyi',
    cold: 'sanyi',
    freezing: 'sanyi mai tsanani',
  },
  condition: {
    clear: 'sararin sama a fili yake',
    cloudy: 'gajimare ya rufe sama',
    fog: 'hazo ya rufe gari',
    drizzle: 'ana yayyafi',
    rain: 'ana ruwan sama',
    snow: 'ana dusar ƙanƙara',
    storm: 'akwai hadari',
  },

  now: (feel, temp, condition) => `Yanzu, akwai ${feel}: ${temp}, kuma ${condition}.`,
  feelsHotter: (temp, humid) =>
    humid
      ? `Amma jiki zai ji kamar ${temp}, saboda iska tana da danshi sosai.`
      : `Amma jiki zai ji kamar ${temp}.`,
  feelsColder: (temp) => `Amma jiki zai ji kamar ${temp}, saboda iska.`,

  rightNow: 'yanzu',
  around: (time) => `wajen ${time}`,
  storm: (when) => `Hadari da tsawa na iya zuwa ${when}. Ka zauna a gida idan za ka iya.`,
  snow: (when) => `Dusar ƙanƙara na iya sauka ${when}. Sa kaya masu kauri.`,
  rain: (when) => `Ruwan sama na iya sauka ${when}. Ɗauki laima.`,
  noRain: 'Ba a tsammanin ruwan sama a cikin awa goma sha biyu masu zuwa.',

  todayRange: (high, low) => `Yau, zafi zai kai ${high}, kuma zai sauka zuwa ${low}.`,
  veryWindy: 'Iska tana da ƙarfi sosai. Ka yi hankali a waje.',
  windy: 'Ana ɗan iska.',
  heatAdvice: 'Sha ruwa da yawa, ka zauna a inuwa.',
  coldAdvice: 'Sa rigar sanyi.',
  strongSun: 'Rana tana da zafi sosai yau. Sa hula ko man kare rana.',
  airUnhealthy: 'Iska ba ta da kyau yau. Ka rage zama a waje.',
  airPoor: 'Iska ba ta da tsabta sosai. Masu cutar asma su yi hankali.',

  weekDry: 'Ba za a yi ruwan sama ba a wannan mako.',
  weekMostlyRain: 'Za a yi ruwan sama kusan kowace rana a wannan mako.',
  weekSomeRain: (days) => `Ana iya yin ruwan sama a kwana ${days} cikin kwanaki bakwai masu zuwa.`,

  morningTitle: (city) => `Barka da safiya! Yanayin ${city}`,
  morningBody: (low, high, rainChance) =>
    rainChance >= 50
      ? `Yau: ${low} zuwa ${high}. Ana iya yin ruwan sama (${rainChance}%). Ɗauki laima.`
      : `Yau: ${low} zuwa ${high}. Ba a tsammanin ruwan sama.`,
};
