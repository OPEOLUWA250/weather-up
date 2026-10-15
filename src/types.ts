import { IconName } from './components/Icon';

// Temperature unit: Celsius or Fahrenheit.
export type Unit = 'C' | 'F';

// A simple category for each kind of weather.
// Used to pick the background colours and to write the plain-words summary.
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
