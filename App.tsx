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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { fetchWeather } from './src/api';
import { isSameCity } from './src/cities';
import { CitySearch } from './src/components/CitySearch';
import { CurrentWeather } from './src/components/CurrentWeather';
import { DailyForecast } from './src/components/DailyForecast';
import { FavouritesBar } from './src/components/FavouritesBar';
import { ForecastSummary } from './src/components/ForecastSummary';
import { HourlyForecast } from './src/components/HourlyForecast';
import { Icon } from './src/components/Icon';
import { UnitToggle } from './src/components/UnitToggle';
import { usePersistentState } from './src/hooks/usePersistentState';
import { getNigerianVoice } from './src/speech';
import { DEFAULT_BACKGROUND, getBackground } from './src/theme';
import { City, Unit, Weather } from './src/types';

// The city shown when the app first opens.
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

export default function App() {
  // State: data that can change. When it changes, the screen re-draws.
  const [city, setCity] = useState<City>(DEFAULT_CITY);
  const [status, setStatus] = useState<Status>('loading');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Like useState, but saved on the phone, so they survive closing the app.
  const [favourites, setFavourites] = usePersistentState<City[]>('favourites', []);
  const [unit, setUnit] = usePersistentState<Unit>('unit', 'C');

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
      setStatus('success');
    } catch (error) {
      console.error('Could not load weather:', error);
      setStatus('error');
    } finally {
      setRefreshing(false);
    }
  }

  // Runs when the app starts AND every time `city` changes.
  useEffect(() => {
    loadWeather();
  }, [city]);

  // Wake up the text-to-speech engine early, so "Read aloud" starts instantly.
  useEffect(() => {
    getNigerianVoice();
  }, []);

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
    <SafeAreaProvider>
      <LinearGradient colors={background} style={styles.background}>
        {/* SafeAreaView keeps content clear of the status bar and system buttons */}
        <SafeAreaView style={styles.container}>
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
                <CurrentWeather
                  weather={weather}
                  unit={unit}
                  isFavourite={isFavourite}
                  onToggleFavourite={toggleFavourite}
                />
                <ForecastSummary weather={weather} unit={unit} />
                <HourlyForecast hours={weather.hourly} unit={unit} />
                <DailyForecast days={weather.daily} unit={unit} />
              </>
            )}
          </ScrollView>

          <StatusBar style="light" />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
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
    color: 'rgba(255, 255, 255, 0.8)',
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
