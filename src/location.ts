import * as Location from 'expo-location';

import { City } from './types';

// Gets the phone's GPS position and turns it into a City we can show weather for.
// If something goes wrong, it throws an Error with a message safe to show the user.
export async function getCurrentCity(): Promise<City> {
  // 1. Ask for permission. Android shows a pop-up the first time.
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission was denied. You can allow it in your phone settings.');
  }

  // 2. Check that location (GPS) is switched on.
  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    throw new Error('Location is turned off. Turn it on in your phone settings.');
  }

  // 3. Get the coordinates. "Balanced" accuracy is faster than "High",
  //    and accurate enough for weather.
  let position: Location.LocationObject;
  try {
    position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch (error) {
    console.error('Could not get GPS position:', error);
    throw new Error("Couldn't find your location. Please try again.");
  }
  const { latitude, longitude } = position.coords;

  // 4. Turn the coordinates into a place name ("reverse geocoding").
  //    If this fails we can still show the weather, just with a generic name.
  let name = 'My Location';
  let region: string | undefined;
  let country: string | undefined;
  try {
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (address) {
      // The API uses `null` for missing values; our City type uses `undefined`.
      name = address.city ?? address.subregion ?? address.region ?? name;
      region = address.region ?? undefined;
      country = address.country ?? undefined;
    }
  } catch (error) {
    console.warn('Could not find a place name for this location:', error);
  }

  // id 0: this place didn't come from the city search, so it has no real ID.
  return { id: 0, name, region, country, latitude, longitude };
}
