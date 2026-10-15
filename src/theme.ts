import { WeatherGroup } from './types';

// Two colours: top of the screen → bottom of the screen.
type Gradient = readonly [string, string];

// Every background stays in the light blue family. The weather only shifts
// the shade a little (greyer for clouds and rain), and night is just a
// slightly deeper blue, never navy.
//
// `Record<WeatherGroup, Gradient>` means: an object with one Gradient for
// EVERY weather group. If we forget one, TypeScript tells us.
const DAY: Record<WeatherGroup, Gradient> = {
  clear: ['#4A90E2', '#87C5F5'],
  cloudy: ['#6E9CC8', '#A9CBE8'],
  fog: ['#7FA2C4', '#B3CDE4'],
  drizzle: ['#5E8FC0', '#98BEE0'],
  rain: ['#5585B5', '#8DB4D9'],
  snow: ['#6FA6DA', '#ABCFEF'],
  storm: ['#4F77A3', '#7FA2C7'],
};

const NIGHT: Record<WeatherGroup, Gradient> = {
  clear: ['#3F7FD0', '#78B4EC'],
  cloudy: ['#5E8CBA', '#96BADD'],
  fog: ['#7092B4', '#A3BED8'],
  drizzle: ['#5281B3', '#88AFD5'],
  rain: ['#4A79AA', '#7EA6CE'],
  snow: ['#6398CC', '#9DC3E6'],
  storm: ['#43699A', '#7193BB'],
};

// Used before any weather has loaded.
export const DEFAULT_BACKGROUND = DAY.clear;

export function getBackground(group: WeatherGroup, isDay: boolean): Gradient {
  return isDay ? DAY[group] : NIGHT[group];
}
