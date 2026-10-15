import { formatHour, formatTemp } from './format';
import { PHRASES } from './i18n';
import { TempFeel } from './i18n/phrases';
import { HourForecast, Language, Unit, Weather, WeatherGroup } from './types';

// Turns the forecast into short, plain sentences with practical advice,
// for people who find numbers and icons hard to understand.
// Everything here is simple if/else rules — no internet or AI needed.
// The rules decide WHAT to say; the language files (src/i18n) decide HOW.

const WET_GROUPS: WeatherGroup[] = ['drizzle', 'rain', 'storm'];

function feelFor(celsius: number): TempFeel {
  if (celsius >= 35) return 'veryHot';
  if (celsius >= 30) return 'hot';
  if (celsius >= 24) return 'warm';
  if (celsius >= 17) return 'mild';
  if (celsius >= 10) return 'cool';
  if (celsius >= 0) return 'cold';
  return 'freezing';
}

export function summarizeWeather(weather: Weather, unit: Unit, language: Language): string[] {
  const say = PHRASES[language];
  const sentences: string[] = [];
  const temp = (celsius: number) => formatTemp(celsius, unit);

  // "right now" for the current hour, otherwise "around 2 PM".
  const when = (hours: HourForecast[], index: number) =>
    index === 0 ? say.rightNow : say.around(formatHour(hours[index].time));

  // 1. How it is right now.
  sentences.push(
    say.now(say.feel[feelFor(weather.feelsLike)], temp(weather.temperature), say.condition[weather.group]),
  );

  // 2. Explain "feels like" when it's very different from the real temperature.
  const difference = weather.feelsLike - weather.temperature;
  if (difference >= 3) {
    sentences.push(say.feelsHotter(temp(weather.feelsLike), weather.humidity >= 60));
  } else if (difference <= -3) {
    sentences.push(say.feelsColder(temp(weather.feelsLike)));
  }

  // 3. Storms, snow or rain in the next 12 hours. The most serious one wins.
  const next12Hours = weather.hourly.slice(0, 12);
  const stormIndex = next12Hours.findIndex((hour) => hour.group === 'storm');
  const snowIndex = next12Hours.findIndex((hour) => hour.group === 'snow');
  const rainIndex = next12Hours.findIndex((hour) => WET_GROUPS.includes(hour.group));

  if (stormIndex !== -1) {
    sentences.push(say.storm(when(next12Hours, stormIndex)));
  } else if (snowIndex !== -1) {
    sentences.push(say.snow(when(next12Hours, snowIndex)));
  } else if (rainIndex !== -1) {
    sentences.push(say.rain(when(next12Hours, rainIndex)));
  } else {
    sentences.push(say.noRain);
  }

  // 4. Today's highest and lowest temperatures.
  const today = weather.daily[0];
  if (today) {
    sentences.push(say.todayRange(temp(today.high), temp(today.low)));
  }

  // 5. Wind.
  if (weather.windSpeed >= 40) {
    sentences.push(say.veryWindy);
  } else if (weather.windSpeed >= 25) {
    sentences.push(say.windy);
  }

  // 6. Advice for heat and cold.
  if (weather.feelsLike >= 30) {
    sentences.push(say.heatAdvice);
  } else if (weather.feelsLike < 10) {
    sentences.push(say.coldAdvice);
  }

  // 7. Strong sun (UV 8+ is "very high") and air pollution.
  if (weather.uvIndex >= 8) {
    sentences.push(say.strongSun);
  }
  if (weather.airQuality !== null && weather.airQuality > 150) {
    sentences.push(say.airUnhealthy);
  } else if (weather.airQuality !== null && weather.airQuality > 100) {
    sentences.push(say.airPoor);
  }

  // 8. The week ahead.
  const rainyDays = weather.daily.filter((day) => day.rainChance >= 50).length;
  if (rainyDays === 0) {
    sentences.push(say.weekDry);
  } else if (rainyDays >= 5) {
    sentences.push(say.weekMostlyRain);
  } else {
    sentences.push(say.weekSomeRain(rainyDays));
  }

  return sentences;
}
