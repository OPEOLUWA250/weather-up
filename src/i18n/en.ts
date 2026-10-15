import { Phrases } from './phrases';

export const en: Phrases = {
  cardTitle: 'In plain words',
  readAloud: 'Read aloud',
  stop: 'Stop',

  feel: {
    veryHot: 'very hot',
    hot: 'hot',
    warm: 'warm',
    mild: 'mild',
    cool: 'cool',
    cold: 'cold',
    freezing: 'freezing',
  },
  condition: {
    clear: 'the sky is clear',
    cloudy: 'it is cloudy',
    fog: 'it is foggy',
    drizzle: 'it is drizzling',
    rain: 'it is raining',
    snow: 'it is snowing',
    storm: 'there is a storm',
  },

  now: (feel, temp, condition) => `Right now it is ${feel}: ${temp}, and ${condition}.`,
  feelsHotter: (temp, humid) =>
    humid
      ? `It feels hotter than that, like ${temp}, because the air is very humid.`
      : `It feels hotter than that, like ${temp}.`,
  feelsColder: (temp) => `It feels colder than that, like ${temp}, because of the wind.`,

  rightNow: 'right now',
  around: (time) => `around ${time}`,
  storm: (when) => `Thunderstorms are possible ${when}. Stay indoors if you can.`,
  snow: (when) => `Snow is likely ${when}. Dress warmly and walk carefully.`,
  rain: (when) => `Rain is likely ${when}. Take an umbrella.`,
  noRain: 'No rain is expected in the next 12 hours.',

  todayRange: (high, low) => `Today it will get up to ${high} and down to ${low}.`,
  veryWindy: 'It is very windy. Be careful outside.',
  windy: 'It is quite windy.',
  heatAdvice: 'Drink plenty of water and stay in the shade.',
  coldAdvice: 'Wear a warm jacket.',
  strongSun: 'The sun is very strong today. Wear a hat or sunscreen.',
  airUnhealthy: 'The air is unhealthy today. Spend less time outside.',
  airPoor: 'The air is not very clean. People with asthma should be careful.',

  weekDry: 'The week looks dry.',
  weekMostlyRain: 'Expect rain on most days this week.',
  weekSomeRain: (days) => `Rain is likely on ${days} of the next 7 days.`,

  morningTitle: (city) => `Good morning! Weather for ${city}`,
  morningBody: (low, high, rainChance) =>
    rainChance >= 50
      ? `Today: ${low} to ${high}. Rain is likely (${rainChance}%). Take an umbrella.`
      : `Today: ${low} to ${high}. Rain is unlikely.`,
};
