import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

// A custom hook: works like useState, but the value is also saved on the
// phone, so it's still there after the app is closed and opened again.
//
// `<T>` is a "generic": T stands for whatever type you use it with.
//   usePersistentState<Unit>('unit', 'C')        → T is Unit
//   usePersistentState<City[]>('favourites', []) → T is City[]
export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  // 1. When the app starts, load the saved value (if there is one).
  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem(key); // Always text, or null
        if (saved !== null) {
          setValue(JSON.parse(saved)); // Text → back into a real value
        }
      } catch (error) {
        console.warn(`Could not load "${key}":`, error);
      } finally {
        setLoaded(true); // `finally` runs whether it worked or not
      }
    }
    load();
  }, [key]);

  // 2. Whenever the value changes, save it.
  //    We wait until loading has finished; otherwise we'd immediately
  //    overwrite the saved value with `initialValue`.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(key, JSON.stringify(value)) // Value → text for storage
      .catch((error) => console.warn(`Could not save "${key}":`, error));
  }, [key, value, loaded]);

  // `as const` tells TypeScript this is exactly [value, setter], like useState.
  return [value, setValue] as const;
}
