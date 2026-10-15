import { Weather } from './types';
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
  daily: {
    // Arrays: one value per day. We ask for 1 day, so we use index [0].
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// `async` means this function does slow work (a network request).
// It returns a Promise: "I'll give you a Weather object when I'm done."
export async function fetchWeather(
  city: string,
  latitude: number,
  longitude: number,
): Promise<Weather> {
  const url =
    `${BASE_URL}?latitude=${latitude}&longitude=${longitude}` +
    '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day' +
    '&daily=temperature_2m_max,temperature_2m_min' +
    '&timezone=auto&forecast_days=1';

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
    city,
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    condition,
    icon,
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
  };
}
