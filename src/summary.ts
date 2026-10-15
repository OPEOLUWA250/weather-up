import { formatHour, formatTemp } from './format';
import { HourForecast, Unit, Weather, WeatherGroup } from './types';

// Turns the forecast into short, plain sentences with practical advice,
// for people who find numbers and icons hard to understand.
// Everything here is simple if/else rules — no internet or AI needed.

const WET_GROUPS: WeatherGroup[] = ['drizzle', 'rain', 'storm'];

function describeTemperature(celsius: number): string {
  if (celsius >= 35) return 'very hot';
  if (celsius >= 30) return 'hot';
  if (celsius >= 24) return 'warm';
  if (celsius >= 17) return 'mild';
  if (celsius >= 10) return 'cool';
  if (celsius >= 0) return 'cold';
  return 'freezing';
}

// "right now" for the current hour, otherwise "around 2 PM".
function describeWhen(hours: HourForecast[], index: number): string {
  return index === 0 ? 'right now' : `around ${formatHour(hours[index].time)}`;
}

export function summarizeWeather(weather: Weather, unit: Unit): string[] {
  const sentences: string[] = [];
  const temp = (celsius: number) => formatTemp(celsius, unit);

  // 1. How it is right now.
  sentences.push(
    `Right now it is ${describeTemperature(weather.feelsLike)}: ` +
      `${temp(weather.temperature)} and ${weather.condition.toLowerCase()}.`,
  );

  // 2. Explain "feels like" when it's very different from the real temperature.
  const difference = weather.feelsLike - weather.temperature;
  if (difference >= 3) {
    const reason = weather.humidity >= 60 ? ', because the air is very humid' : '';
    sentences.push(`It feels hotter than that, like ${temp(weather.feelsLike)}${reason}.`);
  } else if (difference <= -3) {
    sentences.push(`It feels colder than that, like ${temp(weather.feelsLike)}, because of the wind.`);
  }

  // 3. Storms, snow or rain in the next 12 hours. The most serious one wins.
  const next12Hours = weather.hourly.slice(0, 12);
  const stormIndex = next12Hours.findIndex((hour) => hour.group === 'storm');
  const snowIndex = next12Hours.findIndex((hour) => hour.group === 'snow');
  const rainIndex = next12Hours.findIndex((hour) => WET_GROUPS.includes(hour.group));

  if (stormIndex !== -1) {
    sentences.push(
      `Thunderstorms are possible ${describeWhen(next12Hours, stormIndex)}. Stay indoors if you can.`,
    );
  } else if (snowIndex !== -1) {
    sentences.push(
      `Snow is likely ${describeWhen(next12Hours, snowIndex)}. Dress warmly and walk carefully.`,
    );
  } else if (rainIndex !== -1) {
    sentences.push(`Rain is likely ${describeWhen(next12Hours, rainIndex)}. Take an umbrella.`);
  } else {
    sentences.push('No rain is expected in the next 12 hours.');
  }

  // 4. Today's highest and lowest temperatures.
  const today = weather.daily[0];
  if (today) {
    sentences.push(`Today it will get up to ${temp(today.high)} and down to ${temp(today.low)}.`);
  }

  // 5. Wind.
  if (weather.windSpeed >= 40) {
    sentences.push('It is very windy. Be careful outside.');
  } else if (weather.windSpeed >= 25) {
    sentences.push('It is quite windy.');
  }

  // 6. Advice for heat and cold.
  if (weather.feelsLike >= 30) {
    sentences.push('Drink plenty of water and stay in the shade.');
  } else if (weather.feelsLike < 10) {
    sentences.push('Wear a warm jacket.');
  }

  // 7. The week ahead.
  const rainyDays = weather.daily.filter((day) => day.rainChance >= 50).length;
  if (rainyDays === 0) {
    sentences.push('The week looks dry.');
  } else if (rainyDays >= 5) {
    sentences.push('Expect rain on most days this week.');
  } else {
    sentences.push(`Rain is likely on ${rainyDays} of the next 7 days.`);
  }

  return sentences;
}
