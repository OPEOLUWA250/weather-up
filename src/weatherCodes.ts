import { IconName } from './components/Icon';
import { WeatherGroup } from './types';

// Open-Meteo describes the weather with a number called a "WMO weather code".
// This file turns that number into words, a Font Awesome icon, and a group.
// Full list of codes: https://open-meteo.com/en/docs (scroll to "WMO Weather interpretation codes")

interface WeatherInfo {
  condition: string;
  icon: IconName;
  group: WeatherGroup;
}

export function getWeatherInfo(code: number, isDay: boolean): WeatherInfo {
  if (code === 0) return { condition: 'Clear', icon: isDay ? 'sun' : 'moon', group: 'clear' };
  if (code === 1) {
    return { condition: 'Mainly Clear', icon: isDay ? 'sun' : 'moon', group: 'clear' };
  }
  if (code === 2) {
    return { condition: 'Partly Cloudy', icon: isDay ? 'cloud-sun' : 'cloud-moon', group: 'clear' };
  }
  if (code === 3) return { condition: 'Overcast', icon: 'cloud', group: 'cloudy' };
  if (code === 45 || code === 48) return { condition: 'Foggy', icon: 'smog', group: 'fog' };
  if (code >= 51 && code <= 57) {
    return { condition: 'Drizzle', icon: 'cloud-rain', group: 'drizzle' };
  }
  if (code >= 61 && code <= 67) {
    return { condition: 'Rain', icon: 'cloud-showers-heavy', group: 'rain' };
  }
  if (code >= 71 && code <= 77) return { condition: 'Snow', icon: 'snowflake', group: 'snow' };
  if (code >= 80 && code <= 82) {
    return {
      condition: 'Rain Showers',
      icon: isDay ? 'cloud-sun-rain' : 'cloud-moon-rain',
      group: 'rain',
    };
  }
  if (code === 85 || code === 86) {
    return { condition: 'Snow Showers', icon: 'snowflake', group: 'snow' };
  }
  if (code >= 95) return { condition: 'Thunderstorm', icon: 'cloud-bolt', group: 'storm' };
  return { condition: 'Unknown', icon: 'temperature-half', group: 'cloudy' };
}
