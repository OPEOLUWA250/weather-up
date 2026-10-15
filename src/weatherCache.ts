import AsyncStorage from '@react-native-async-storage/async-storage';

import { cityKey } from './cities';
import { City, Weather } from './types';

// Saves every forecast we download, so the app still has something to show
// when there's no internet.

interface SavedWeather {
  weather: Weather;
  savedAt: number; // When it was saved, in milliseconds (Date.now())
}

function storageKey(city: City): string {
  return `weather:${cityKey(city)}`; // e.g. "weather:6.45,3.39"
}

export async function saveWeather(city: City, weather: Weather): Promise<void> {
  const saved: SavedWeather = { weather, savedAt: Date.now() };
  try {
    await AsyncStorage.setItem(storageKey(city), JSON.stringify(saved));
  } catch (error) {
    console.warn('Could not save weather for offline use:', error);
  }
}

// Returns the last saved forecast for this city, or null if there isn't one.
export async function loadSavedWeather(city: City): Promise<SavedWeather | null> {
  try {
    const text = await AsyncStorage.getItem(storageKey(city));
    return text === null ? null : JSON.parse(text);
  } catch (error) {
    console.warn('Could not read saved weather:', error);
    return null;
  }
}
