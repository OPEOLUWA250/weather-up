import {
  airQualityLevel,
  formatAge,
  formatDay,
  formatHour,
  formatTemp,
  formatTime,
  uvLevel,
} from './format';

// A test file: `describe` groups tests, `test` is one check, and
// `expect(actual).toBe(expected)` fails the test if they're different.
// Run them all with:  npm test

describe('formatTemp', () => {
  test('rounds Celsius', () => {
    expect(formatTemp(26.6, 'C')).toBe('27°');
    expect(formatTemp(26.4, 'C')).toBe('26°');
  });

  test('converts to Fahrenheit', () => {
    expect(formatTemp(0, 'F')).toBe('32°'); // Water freezes
    expect(formatTemp(100, 'F')).toBe('212°'); // Water boils
    expect(formatTemp(-40, 'F')).toBe('-40°'); // The one temperature where both match
  });
});

describe('formatHour', () => {
  test('handles midnight and noon, the classic 12-hour clock traps', () => {
    expect(formatHour('2026-10-16T00:00')).toBe('12 AM');
    expect(formatHour('2026-10-16T12:00')).toBe('12 PM');
  });

  test('handles ordinary hours', () => {
    expect(formatHour('2026-10-16T09:00')).toBe('9 AM');
    expect(formatHour('2026-10-16T13:00')).toBe('1 PM');
    expect(formatHour('2026-10-16T23:00')).toBe('11 PM');
  });
});

describe('formatTime', () => {
  test('keeps the minutes with a leading zero', () => {
    expect(formatTime('2026-10-16T06:32')).toBe('6:32 AM');
    expect(formatTime('2026-10-16T18:05')).toBe('6:05 PM');
    expect(formatTime('2026-10-16T00:07')).toBe('12:07 AM');
  });
});

describe('formatDay', () => {
  test('gives the right weekday', () => {
    expect(formatDay('2026-10-15')).toBe('Thu');
    expect(formatDay('2026-10-18')).toBe('Sun');
  });

  test('works across the new year', () => {
    expect(formatDay('2026-12-31')).toBe('Thu');
    expect(formatDay('2027-01-01')).toBe('Fri');
  });
});

describe('formatAge', () => {
  const now = Date.UTC(2026, 9, 16, 12, 0); // A fixed "now", so the test never changes
  const minutes = (n: number) => now - n * 60_000;

  test('says "just now" for under a minute', () => {
    expect(formatAge(now - 30_000, now)).toBe('just now');
  });

  test('uses singular and plural correctly', () => {
    expect(formatAge(minutes(1), now)).toBe('1 minute ago');
    expect(formatAge(minutes(5), now)).toBe('5 minutes ago');
    expect(formatAge(minutes(60), now)).toBe('1 hour ago');
    expect(formatAge(minutes(180), now)).toBe('3 hours ago');
    expect(formatAge(minutes(60 * 24), now)).toBe('1 day ago');
    expect(formatAge(minutes(60 * 48), now)).toBe('2 days ago');
  });
});

describe('levels', () => {
  test('UV index words follow the WHO scale', () => {
    expect(uvLevel(2)).toBe('Low');
    expect(uvLevel(5)).toBe('Moderate');
    expect(uvLevel(7)).toBe('High');
    expect(uvLevel(8.45)).toBe('Very high');
    expect(uvLevel(11)).toBe('Extreme');
  });

  test('air quality words follow the US AQI scale', () => {
    expect(airQualityLevel(42)).toBe('Good');
    expect(airQualityLevel(92)).toBe('Moderate');
    expect(airQualityLevel(120)).toBe('Poor for some');
    expect(airQualityLevel(180)).toBe('Unhealthy');
  });
});
