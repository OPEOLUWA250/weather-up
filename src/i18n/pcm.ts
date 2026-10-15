import { Phrases } from './phrases';

// Nigerian Pidgin
export const pcm: Phrases = {
  cardTitle: 'Simple talk',
  readAloud: 'Read am out',
  stop: 'Stop',

  feel: {
    veryHot: 'hot well well',
    hot: 'hot',
    warm: 'warm small',
    mild: 'dey okay',
    cool: 'cool small',
    cold: 'cold',
    freezing: 'cold well well',
  },
  condition: {
    clear: 'sky clear',
    cloudy: 'cloud cover sky',
    fog: 'fog dey',
    drizzle: 'small rain dey fall',
    rain: 'rain dey fall',
    snow: 'snow dey fall',
    storm: 'storm dey',
  },

  now: (feel, temp, condition) => `Right now, weather ${feel}: ${temp}, and ${condition}.`,
  feelsHotter: (temp, humid) =>
    humid
      ? `But for body, e go feel like ${temp}, because the air get plenty water.`
      : `But for body, e go feel like ${temp}.`,
  feelsColder: (temp) => `But for body, e go feel like ${temp}, because of breeze.`,

  rightNow: 'now now',
  around: (time) => `around ${time}`,
  storm: (when) => `Thunder and heavy rain fit come ${when}. Stay inside if you fit.`,
  snow: (when) => `Snow fit fall ${when}. Wear thick cloth and waka carefully.`,
  rain: (when) => `Rain fit fall ${when}. Carry umbrella.`,
  noRain: 'Rain no go fall for the next 12 hours.',

  todayRange: (high, low) => `Today, heat go reach ${high}, and e go come down reach ${low}.`,
  veryWindy: 'Breeze strong well well. Take care outside.',
  windy: 'Breeze dey blow well.',
  heatAdvice: 'Drink plenty water and stay for shade.',
  coldAdvice: 'Wear jacket make cold no catch you.',
  strongSun: 'Sun strong well well today. Wear cap or rub sunscreen.',
  airUnhealthy: 'Air no good today. No stay outside too much.',
  airPoor: 'Air no too clean. If you get asthma, take care.',

  weekDry: 'Rain no go fall this week.',
  weekMostlyRain: 'Rain go fall almost every day this week.',
  weekSomeRain: (days) => `Rain fit fall for ${days} out of the next 7 days.`,

  morningTitle: (city) => `Good morning! Weather for ${city}`,
  morningBody: (low, high, rainChance) =>
    rainChance >= 50
      ? `Today: ${low} reach ${high}. Rain fit fall (${rainChance}%). Carry umbrella.`
      : `Today: ${low} reach ${high}. Rain no dey show.`,
};
