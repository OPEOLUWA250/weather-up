import { WeatherGroup } from './types';

// Two colours: top of the screen → bottom of the screen.
type Gradient = readonly [string, string];

// `Record<WeatherGroup, Gradient>` means: an object with one Gradient for
// EVERY weather group. If we forget one, TypeScript tells us.
const DAY: Record<WeatherGroup, Gradient> = {
  clear: ['#4A90E2', '#87C5F5'],
  cloudy: ['#5F7C96', '#9AB0C2'],
  fog: ['#76858F', '#AAB7C0'],
  drizzle: ['#4F6D8A', '#7D97AE'],
  rain: ['#3E5770', '#6A829A'],
  snow: ['#5B86A8', '#9DBAD3'],
  storm: ['#2C3E50', '#4B6584'],
};

const NIGHT: Record<WeatherGroup, Gradient> = {
  clear: ['#0B1D3A', '#1F3B66'],
  cloudy: ['#1E2730', '#3A4652'],
  fog: ['#2A333A', '#4A565F'],
  drizzle: ['#1A2633', '#2F4256'],
  rain: ['#141F2B', '#2A3B4D'],
  snow: ['#26374A', '#4A6580'],
  storm: ['#0D1117', '#232F3E'],
};

// Used before any weather has loaded.
export const DEFAULT_BACKGROUND = DAY.clear;

export function getBackground(group: WeatherGroup, isDay: boolean): Gradient {
  return isDay ? DAY[group] : NIGHT[group];
}
