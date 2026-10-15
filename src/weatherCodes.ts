// Open-Meteo describes the weather with a number called a "WMO weather code".
// This file turns that number into words and an emoji we can show.
// Full list of codes: https://open-meteo.com/en/docs (scroll to "WMO Weather interpretation codes")

interface WeatherInfo {
  condition: string;
  icon: string;
}

export function getWeatherInfo(code: number, isDay: boolean): WeatherInfo {
  if (code === 0) return { condition: 'Clear', icon: isDay ? '☀️' : '🌙' };
  if (code === 1) return { condition: 'Mainly Clear', icon: isDay ? '🌤️' : '🌙' };
  if (code === 2) return { condition: 'Partly Cloudy', icon: '⛅' };
  if (code === 3) return { condition: 'Overcast', icon: '☁️' };
  if (code === 45 || code === 48) return { condition: 'Foggy', icon: '🌫️' };
  if (code >= 51 && code <= 57) return { condition: 'Drizzle', icon: '🌦️' };
  if (code >= 61 && code <= 67) return { condition: 'Rain', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', icon: '❄️' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: '🌦️' };
  if (code === 85 || code === 86) return { condition: 'Snow Showers', icon: '🌨️' };
  if (code >= 95) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Unknown', icon: '🌡️' };
}
