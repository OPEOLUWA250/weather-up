import { LANGUAGE_NAMES } from './i18n';
import { summarizeWeather } from './summary';
import { HourForecast, Language, Weather, WeatherGroup } from './types';

// Builds a calm, dry, mild day. Each test changes only what it cares about.
function makeWeather(changes: Partial<Weather> = {}): Weather {
  const hours: HourForecast[] = Array.from({ length: 24 }, (_, i) => ({
    time: `2026-10-16T${String(i).padStart(2, '0')}:00`,
    temperature: 20,
    icon: 'sun',
    group: 'clear',
  }));

  return {
    city: 'Testville',
    temperature: 20,
    feelsLike: 20,
    condition: 'Clear',
    icon: 'sun',
    group: 'clear',
    isDay: true,
    high: 24,
    low: 16,
    humidity: 50,
    windSpeed: 10,
    uvIndex: 3,
    airQuality: 30,
    sunrise: '2026-10-16T06:30',
    sunset: '2026-10-16T18:30',
    hourly: hours,
    daily: Array.from({ length: 7 }, (_, i) => ({
      date: `2026-10-${16 + i}`,
      high: 24,
      low: 16,
      icon: 'sun',
      group: 'clear',
      rainChance: 0,
    })),
    ...changes, // Spread: anything in `changes` replaces the default above
  };
}

// Makes hour number `index` have a certain kind of weather.
function withHour(weather: Weather, index: number, group: WeatherGroup): Weather {
  const hourly = weather.hourly.map((hour, i) => (i === index ? { ...hour, group } : hour));
  return { ...weather, hourly };
}

const english = (weather: Weather) => summarizeWeather(weather, 'C', 'en').join(' ');

describe('summarizeWeather (English)', () => {
  test('a calm day: no rain, dry week, no warnings', () => {
    const text = english(makeWeather());
    expect(text).toContain('No rain is expected');
    expect(text).toContain('The week looks dry.');
    expect(text).not.toContain('umbrella');
    expect(text).not.toContain('sunscreen');
  });

  test('rain later today says when, and suggests an umbrella', () => {
    const text = english(withHour(makeWeather(), 5, 'rain')); // Hour 5 = 5 AM
    expect(text).toContain('Rain is likely around 5 AM. Take an umbrella.');
  });

  test('rain in the current hour says "right now"', () => {
    const text = english(withHour(makeWeather(), 0, 'rain'));
    expect(text).toContain('Rain is likely right now.');
  });

  test('a storm is more important than rain', () => {
    const weather = withHour(withHour(makeWeather(), 2, 'rain'), 6, 'storm');
    const text = english(weather);
    expect(text).toContain('Thunderstorms are possible around 6 AM');
    expect(text).not.toContain('Take an umbrella');
  });

  test('rain more than 12 hours away is not mentioned', () => {
    const text = english(withHour(makeWeather(), 15, 'rain'));
    expect(text).toContain('No rain is expected in the next 12 hours.');
  });

  test('explains humid heat and gives heat advice', () => {
    const text = english(makeWeather({ temperature: 31, feelsLike: 38, humidity: 85 }));
    expect(text).toContain('Right now it is very hot');
    expect(text).toContain('because the air is very humid');
    expect(text).toContain('Drink plenty of water');
  });

  test('explains wind chill and gives cold advice', () => {
    const text = english(makeWeather({ temperature: 7, feelsLike: 2 }));
    expect(text).toContain('because of the wind');
    expect(text).toContain('Wear a warm jacket.');
  });

  test('warns about strong sun and bad air', () => {
    const text = english(makeWeather({ uvIndex: 9, airQuality: 170 }));
    expect(text).toContain('Wear a hat or sunscreen.');
    expect(text).toContain('The air is unhealthy today.');
  });

  test('missing air quality does not crash or warn', () => {
    const text = english(makeWeather({ airQuality: null }));
    expect(text).not.toContain('air is');
  });

  test('counts rainy days in the week', () => {
    const weather = makeWeather();
    weather.daily[2].rainChance = 80;
    weather.daily[4].rainChance = 60;
    expect(english(weather)).toContain('Rain is likely on 2 of the next 7 days.');
  });

  test('uses Fahrenheit when asked', () => {
    const text = summarizeWeather(makeWeather({ temperature: 30 }), 'F', 'en').join(' ');
    expect(text).toContain('86°'); // 30 °C = 86 °F
  });
});

describe('summarizeWeather (every language)', () => {
  const languages = Object.keys(LANGUAGE_NAMES) as Language[];
  // A busy day that uses as many sentences as possible.
  const busyDay = withHour(
    makeWeather({ temperature: 31, feelsLike: 38, humidity: 85, windSpeed: 45, uvIndex: 9, airQuality: 120 }),
    3,
    'rain',
  );

  test.each(languages)('%s gives the same number of sentences as English', (language) => {
    const english = summarizeWeather(busyDay, 'C', 'en');
    const translated = summarizeWeather(busyDay, 'C', language);
    expect(translated).toHaveLength(english.length);
  });

  test.each(languages)('%s has no empty or broken sentences', (language) => {
    for (const sentence of summarizeWeather(busyDay, 'C', language)) {
      expect(sentence.trim().length).toBeGreaterThan(0);
      expect(sentence).not.toContain('undefined');
      expect(sentence).not.toContain('NaN');
    }
  });
});
