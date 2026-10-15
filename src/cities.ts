import { City } from './types';

// A short text that identifies a place by its coordinates, rounded to
// 2 decimal places (about 1 km). We can't use `id`, because every GPS
// location has id 0.
export function cityKey(city: City): string {
  return `${city.latitude.toFixed(2)},${city.longitude.toFixed(2)}`;
}

export function isSameCity(a: City, b: City): boolean {
  return cityKey(a) === cityKey(b);
}
