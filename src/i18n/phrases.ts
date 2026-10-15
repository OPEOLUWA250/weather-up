import { WeatherGroup } from '../types';

// How hot or cold it feels, in words.
export type TempFeel = 'veryHot' | 'hot' | 'warm' | 'mild' | 'cool' | 'cold' | 'freezing';

// Every sentence the plain-words summary can say, in one language.
// Each language file (en.ts, pcm.ts, ...) fills this in. Because they all
// follow this interface, TypeScript tells us if a translation is missing.
//
// Temperatures arrive already formatted (e.g. "27°"), and times as "2 PM".
export interface Phrases {
  cardTitle: string;
  readAloud: string;
  stop: string;

  feel: Record<TempFeel, string>;
  condition: Record<WeatherGroup, string>;

  now: (feel: string, temp: string, condition: string) => string;
  feelsHotter: (temp: string, humid: boolean) => string;
  feelsColder: (temp: string) => string;

  rightNow: string;
  around: (time: string) => string;
  storm: (when: string) => string;
  snow: (when: string) => string;
  rain: (when: string) => string;
  noRain: string;

  todayRange: (high: string, low: string) => string;
  veryWindy: string;
  windy: string;
  heatAdvice: string;
  coldAdvice: string;
  strongSun: string;
  airUnhealthy: string;
  airPoor: string;

  weekDry: string;
  weekMostlyRain: string;
  weekSomeRain: (days: number) => string;

  morningTitle: (city: string) => string;
  morningBody: (low: string, high: string, rainChance: number) => string;
}
