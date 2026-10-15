import { IconName } from './components/Icon';

// Temperature unit: Celsius or Fahrenheit.
export type Unit = 'C' | 'F';

// Languages for the plain-words summary:
// English, Nigerian Pidgin, Yorùbá, Igbo, Hausa.
export type Language = 'en' | 'pcm' | 'yo' | 'ig' | 'ha';

// How fast "Read aloud" speaks.
export type VoiceSpeed = 'slow' | 'normal' | 'fast';

// A simple category for each kind of weather.
// Used to pick the background, the animation, and the plain-words summary.
export type WeatherGroup = 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';

// Describes the shape of the weather data our app displays.
// `export` lets other files import it.
// Temperatures are stored in °C and NOT rounded: we convert and round
// only when displaying them (see formatTemp in format.ts).
export interface Weather {
  city: string;
  temperature: number; // °C
  feelsLike: number; // °C
  condition: string;
  icon: IconName; // A Font Awesome icon name, e.g. 'sun'
  group: WeatherGroup;
  isDay: boolean;
  high: number; // °C
  low: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  uvIndex: number; // Today's highest UV index (0 = none, 11+ = extreme)
  airQuality: number | null; // US Air Quality Index, or null if unavailable
  sunrise: string; // The city's local time, e.g. "2026-10-16T06:32"
  sunset: string;
  hourly: HourForecast[]; // The next 24 hours
  daily: DayForecast[]; // The next 7 days, starting today
}

// The forecast for one hour.
export interface HourForecast {
  time: string; // The city's local time, e.g. "2026-10-16T09:00"
  temperature: number; // °C
  icon: IconName;
  group: WeatherGroup;
}

// The forecast for one day.
export interface DayForecast {
  date: string; // e.g. "2026-10-16"
  high: number; // °C
  low: number; // °C
  icon: IconName;
  group: WeatherGroup;
  rainChance: number; // %
}

// A place the user can pick, from the city search API.
export interface City {
  id: number;
  name: string;
  region?: string; // e.g. a state. `?` means it might be missing.
  country?: string;
  latitude: number;
  longitude: number;
}
