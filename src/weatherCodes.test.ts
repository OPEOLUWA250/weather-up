import { getWeatherInfo } from './weatherCodes';

describe('getWeatherInfo', () => {
  test('clear sky shows a sun by day and a moon at night', () => {
    expect(getWeatherInfo(0, true).icon).toBe('sun');
    expect(getWeatherInfo(0, false).icon).toBe('moon');
  });

  test.each([
    [3, 'cloudy'],
    [45, 'fog'],
    [53, 'drizzle'],
    [63, 'rain'],
    [81, 'rain'],
    [73, 'snow'],
    [95, 'storm'],
    [99, 'storm'],
  ])('code %i is in the "%s" group', (code, group) => {
    expect(getWeatherInfo(code, true).group).toBe(group);
  });

  test('an unknown code does not crash', () => {
    expect(getWeatherInfo(42, true).condition).toBe('Unknown');
  });
});
