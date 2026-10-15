// Describes the shape of the weather data our app displays.
// `export` lets other files import it.
export interface Weather {
  city: string;
  temperature: number; // °C
  feelsLike: number; // °C
  condition: string;
  icon: string;
  high: number; // °C
  low: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
}
