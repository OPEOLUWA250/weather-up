import { cityKey, isSameCity } from './cities';
import { City } from './types';

const lagos: City = { id: 2332459, name: 'Lagos', latitude: 6.45407, longitude: 3.39467 };

describe('isSameCity', () => {
  test('a GPS reading a few metres away counts as the same place', () => {
    const gps: City = { id: 0, name: 'My Location', latitude: 6.4539, longitude: 3.3949 };
    expect(isSameCity(lagos, gps)).toBe(true);
  });

  test('a different part of Lagos is a different place', () => {
    const ijegun: City = { id: 1, name: 'Ijegun', latitude: 6.51636, longitude: 3.25494 };
    expect(isSameCity(lagos, ijegun)).toBe(false);
  });

  test('the key is the rounded coordinates', () => {
    expect(cityKey(lagos)).toBe('6.45,3.39');
  });
});
