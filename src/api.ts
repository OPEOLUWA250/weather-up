import { City, Weather } from './types';
import { getWeatherInfo } from './weatherCodes';

// The shape of the JSON that Open-Meteo sends back (only the parts we use).
interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number; // 1 = day, 0 = night
  };
  // Hourly data comes as separate lists that line up by position:
  // time[3], temperature_2m[3] and weather_code[3] all describe the same hour.
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    is_day: number[];
  };
  // Daily data works the same way. Index [0] is today.
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[]; // Can be missing for some days
  };
}

// The shape of the JSON from the city search (geocoding) API.
interface GeocodingResponse {
  // `?` because the API leaves `results` out entirely when nothing matches.
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string; // state / region
  }[];
}

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// `async` means this function does slow work (a network request).
// It returns a Promise: "I'll give you a Weather object when I'm done."
export async function fetchWeather(city: City): Promise<Weather> {
  const url =
    `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}` +
    '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day' +
    '&hourly=temperature_2m,weather_code,is_day' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    '&timezone=auto&forecast_days=7&forecast_hours=24';

  // `await` pauses here until the server responds.
  const response = await fetch(url);

  // `ok` is false for errors like 404 (not found) or 500 (server problem).
  if (!response.ok) {
    throw new Error(`Weather request failed (status ${response.status})`);
  }

  const data: OpenMeteoResponse = await response.json();
  const { condition, icon } = getWeatherInfo(
    data.current.weather_code,
    data.current.is_day === 1,
  );

  // Convert the API's format into our app's own Weather format.
  return {
    city: city.country ? `${city.name}, ${city.country}` : city.name,
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    condition,
    icon,
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    // Combine the separate lists into one object per hour, using the index `i`.
    hourly: data.hourly.time.map((time, i) => ({
      time,
      temperature: Math.round(data.hourly.temperature_2m[i]),
      icon: getWeatherInfo(data.hourly.weather_code[i], data.hourly.is_day[i] === 1).icon,
    })),
    daily: data.daily.time.map((date, i) => ({
      date,
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
      icon: getWeatherInfo(data.daily.weather_code[i], true).icon, // Daytime icons
      rainChance: data.daily.precipitation_probability_max[i] ?? 0,
    })),
  };
}

// Turns a name like "Abuja" into a list of matching places with coordinates.
export async function searchCities(query: string): Promise<City[]> {
  // encodeURIComponent makes text safe for a URL, e.g. "New York" → "New%20York"
  const url =
    `${GEOCODING_URL}?name=${encodeURIComponent(query)}` +
    '&count=5&language=en&format=json';

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`City search failed (status ${response.status})`);
  }

  const data: GeocodingResponse = await response.json();

  // `?? []` means "if results is missing, use an empty list instead".
  // `.map()` converts each API result into our own City format.
  return (data.results ?? []).map((result) => ({
    id: result.id,
    name: result.name,
    region: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}
