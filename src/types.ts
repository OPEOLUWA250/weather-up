import { IconName } from './components/Icon';

// Describes the shape of the weather data our app displays.
// `export` lets other files import it.
export interface Weather {
  city: string;
  temperature: number; // °C
  feelsLike: number; // °C
  condition: string;
  icon: IconName; // A Font Awesome icon name, e.g. 'sun'
  high: number; // °C
  low: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  hourly: HourForecast[]; // The next 24 hours
  daily: DayForecast[]; // The next 7 days, starting today
}

// The forecast for one day.
export interface DayForecast {
  date: string; // e.g. "2026-10-16"
  high: number; // °C
  low: number; // °C
  icon: IconName;
  rainChance: number; // %
}

// The forecast for one hour.
export interface HourForecast {
  time: string; // The city's local time, e.g. "2026-10-16T09:00"
  temperature: number; // °C
  icon: IconName;
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
