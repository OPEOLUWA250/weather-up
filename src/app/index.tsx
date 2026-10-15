import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchWeather } from '../api';
import { isSameCity } from '../cities';
import { AppHeader } from '../components/AppHeader';
import { CitySearch } from '../components/CitySearch';
import { CurrentWeather } from '../components/CurrentWeather';
import { DailyForecast } from '../components/DailyForecast';
import { FavouritesBar } from '../components/FavouritesBar';
import { ForecastSummary } from '../components/ForecastSummary';
import { HourlyForecast } from '../components/HourlyForecast';
import { Icon } from '../components/Icon';
import { OfflineBanner } from '../components/OfflineBanner';
import { TodayDetails } from '../components/TodayDetails';
import { UnitToggle } from '../components/UnitToggle';
import { WeatherAnimation } from '../components/WeatherAnimation';
import { usePersistentState } from '../hooks/usePersistentState';
import { cancelMorningAlerts, scheduleMorningAlerts } from '../notifications';
import { useSettings } from '../settings';
import { DEFAULT_BACKGROUND, getBackground } from '../theme';
import { City, Weather } from '../types';
import { loadSavedWeather, saveWeather } from '../weatherCache';

// The city shown the very first time the app opens.
const DEFAULT_CITY: City = {
  id: 2332459,
  name: 'Lagos',
  region: 'Lagos',
  country: 'Nigeria',
  latitude: 6.45407,
  longitude: 3.39467,
};

// A union type: the screen is always in exactly ONE of these states.
type Status = 'loading' | 'success' | 'error';

export default function HomeScreen() {
  // Shared settings from React Context (also changed on the Settings screen).
  const { unit, setUnit, language, morningAlert, loaded: settingsLoaded } = useSettings();

  // Saved on the phone, so they survive closing the app.
  // The last city you viewed is saved too, so the app reopens on it.
  const [city, setCity, cityLoaded] = usePersistentState<City>('lastCity', DEFAULT_CITY);
  const [favourites, setFavourites] = usePersistentState<City[]>('favourites', []);

  const [status, setStatus] = useState<Status>('loading');
  const [weather, setWeather] = useState<Weather | null>(null);
  // When the shown weather was saved, if it's an offline copy. null = fresh from the internet.
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // `isRefresh` is true when the user pulls down to refresh: we keep the
  // current weather on screen and show the small pull-down spinner instead.
  async function loadWeather(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setStatus('loading');
    }

    try {
      const data = await fetchWeather(city);
      setWeather(data);
      setSavedAt(null);
      setStatus('success');
      saveWeather(city, data); // Keep a copy for when we're offline
    } catch (error) {
      // No internet? Fall back to the last saved forecast for this city.
      console.warn('Could not load weather, trying a saved copy:', error);
      const saved = await loadSavedWeather(city);
      if (saved !== null) {
        setWeather(saved.weather);
        setSavedAt(saved.savedAt);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } finally {
      setRefreshing(false);
    }
  }

  // Load the weather once we know which city to show, and whenever it changes.
  // (Waiting for `cityLoaded` stops us loading Lagos first and then the saved city.)
  useEffect(() => {
    if (cityLoaded) {
      loadWeather();
    }
  }, [city, cityLoaded]);

  // Keep the morning alerts up to date. Only fresh weather is used, not a saved copy.
  useEffect(() => {
    if (!settingsLoaded) return;
    if (!morningAlert) {
      cancelMorningAlerts().catch((error) => console.warn('Could not cancel alerts:', error));
    } else if (weather !== null && savedAt === null) {
      scheduleMorningAlerts(weather, language, unit).catch((error) =>
        console.warn('Could not schedule morning alerts:', error),
      );
    }
  }, [settingsLoaded, morningAlert, weather, savedAt, language, unit]);

  const isFavourite = favourites.some((saved) => isSameCity(saved, city));

  function toggleFavourite() {
    if (isFavourite) {
      // .filter() keeps every city EXCEPT this one
      setFavourites(favourites.filter((saved) => !isSameCity(saved, city)));
    } else {
      // [...list, item] makes a NEW list with the item added at the end
      setFavourites([...favourites, city]);
    }
  }

  // The background follows the weather. Before any weather loads, use the default.
  const background = weather ? getBackground(weather.group, weather.isDay) : DEFAULT_BACKGROUND;

  return (
    <LinearGradient colors={background} style={styles.background}>
      {weather !== null && (
        // `key` makes React start a fresh animation when the weather type changes.
        <WeatherAnimation
          key={`${weather.group}-${weather.isDay}`}
          group={weather.group}
          isDay={weather.isDay}
        />
      )}

      {/* SafeAreaView keeps content clear of the status bar and system buttons */}
      <SafeAreaView style={styles.container}>
        <AppHeader />
        <CitySearch onSelectCity={setCity} />

        <View style={styles.topRow}>
          <View style={styles.favourites}>
            <FavouritesBar favourites={favourites} selectedCity={city} onSelect={setCity} />
          </View>
          <UnitToggle unit={unit} onChange={setUnit} />
        </View>

        {/* ScrollView lets the content scroll if it doesn't fit on screen */}
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false} // Hide the scrollbar on the right
          overScrollMode="never" // Android: no stretch effect at the top/bottom
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadWeather(true)}
              colors={['#4A90E2']} // Android spinner colour
              tintColor="#fff" // iOS spinner colour
            />
          }
        >
          {/* `condition && (...)` shows the UI only when the condition is true */}
          {status === 'loading' && (
            <>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.message}>Loading weather...</Text>
            </>
          )}

          {status === 'error' && (
            <>
              <Icon name="triangle-exclamation" size={64} color="#fff" style={styles.icon} />
              <Text style={styles.errorTitle}>Couldn't load the weather</Text>
              <Text style={styles.message}>
                Check your internet connection and try again.
              </Text>
              <Pressable
                // An arrow function, so loadWeather gets NO arguments (isRefresh = false)
                onPress={() => loadWeather()}
                style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
              >
                <Text style={styles.retryButtonText}>Try again</Text>
              </Pressable>
            </>
          )}

          {status === 'success' && weather !== null && (
            <>
              {savedAt !== null && <OfflineBanner savedAt={savedAt} />}
              <CurrentWeather
                weather={weather}
                unit={unit}
                isFavourite={isFavourite}
                onToggleFavourite={toggleFavourite}
              />
              <ForecastSummary weather={weather} unit={unit} />
              <TodayDetails weather={weather} />
              <HourlyForecast hours={weather.hourly} unit={unit} isLive={savedAt === null} />
              <DailyForecast days={weather.daily} unit={unit} />
            </>
          )}
        </ScrollView>

        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  favourites: {
    flex: 1, // Take all the space the unit toggle doesn't need
    marginRight: 12,
  },
  content: {
    flexGrow: 1, // Fill the available space so content can be centred
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  icon: {
    marginVertical: 16,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginTop: 12,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  retryButtonPressed: {
    opacity: 0.7,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
});
