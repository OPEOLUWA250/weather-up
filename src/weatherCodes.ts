import { IconName } from './components/Icon';

// Open-Meteo describes the weather with a number called a "WMO weather code".
// This file turns that number into words and a Font Awesome icon we can show.
// Full list of codes: https://open-meteo.com/en/docs (scroll to "WMO Weather interpretation codes")

interface WeatherInfo {
  condition: string;
  icon: IconName;
}

export function getWeatherInfo(code: number, isDay: boolean): WeatherInfo {
  if (code === 0) return { condition: 'Clear', icon: isDay ? 'sun' : 'moon' };
  if (code === 1) return { condition: 'Mainly Clear', icon: isDay ? 'sun' : 'moon' };
  if (code === 2) return { condition: 'Partly Cloudy', icon: isDay ? 'cloud-sun' : 'cloud-moon' };
  if (code === 3) return { condition: 'Overcast', icon: 'cloud' };
  if (code === 45 || code === 48) return { condition: 'Foggy', icon: 'smog' };
  if (code >= 51 && code <= 57) return { condition: 'Drizzle', icon: 'cloud-rain' };
  if (code >= 61 && code <= 67) return { condition: 'Rain', icon: 'cloud-showers-heavy' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', icon: 'snowflake' };
  if (code >= 80 && code <= 82) {
    return { condition: 'Rain Showers', icon: isDay ? 'cloud-sun-rain' : 'cloud-moon-rain' };
  }
  if (code === 85 || code === 86) return { condition: 'Snow Showers', icon: 'snowflake' };
  if (code >= 95) return { condition: 'Thunderstorm', icon: 'cloud-bolt' };
  return { condition: 'Unknown', icon: 'temperature-half' };
}
