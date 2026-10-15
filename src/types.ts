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
