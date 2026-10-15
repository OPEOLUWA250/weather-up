import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { fetchWeather } from './src/api';
import { CitySearch } from './src/components/CitySearch';
import { Icon } from './src/components/Icon';
import { City, Weather } from './src/types';

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

// Props are the inputs a component receives, like arguments to a function.
interface DetailItemProps {
  label: string;
  value: string;
}

// A small reusable component: one value with a label underneath.
function DetailItem({ label, value }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
  );
}

export default function App() {
  // State: data that can change. When it changes, the screen re-draws.
  const [city, setCity] = useState<City>(DEFAULT_CITY);
  const [status, setStatus] = useState<Status>('loading');
  const [weather, setWeather] = useState<Weather | null>(null);

  // Defined here (not inside useEffect) so the "Try again" button can call it too.
  async function loadWeather() {
    setStatus('loading');
    try {
      const data = await fetchWeather(city);
      setWeather(data);
      setStatus('success');
    } catch (error) {
      console.error('Could not load weather:', error);
      setStatus('error');
    }
  }

  // Runs when the app starts AND every time `city` changes.
  useEffect(() => {
    loadWeather();
  }, [city]);

  return (
    <SafeAreaProvider>
      {/* SafeAreaView keeps content clear of the status bar and system buttons */}
      <SafeAreaView style={styles.container}>
        <CitySearch onSelectCity={setCity} />

        {/* ScrollView lets the content scroll if it doesn't fit on screen */}
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
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
                onPress={loadWeather}
                style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
              >
                <Text style={styles.retryButtonText}>Try again</Text>
              </Pressable>
            </>
          )}

          {status === 'success' && weather !== null && (
            <>
              <Text style={styles.city}>{weather.city}</Text>
              <Icon name={weather.icon} size={96} color="#fff" style={styles.icon} />
              <Text style={styles.temperature}>{weather.temperature}°</Text>
              <Text style={styles.condition}>{weather.condition}</Text>
              <Text style={styles.highLow}>
                H: {weather.high}°   L: {weather.low}°
              </Text>

              <View style={styles.detailsCard}>
                <DetailItem label="Feels like" value={`${weather.feelsLike}°`} />
                <DetailItem label="Humidity" value={`${weather.humidity}%`} />
                <DetailItem label="Wind" value={`${weather.windSpeed} km/h`} />
              </View>
            </>
          )}
        </ScrollView>

        <StatusBar style="light" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
  },
  content: {
    flexGrow: 1, // Fill the available space so content can be centred
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  city: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  icon: {
    marginVertical: 16,
  },
  temperature: {
    fontSize: 96,
    fontWeight: '200',
    color: '#fff',
  },
  condition: {
    fontSize: 24,
    color: '#fff',
  },
  highLow: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  detailsCard: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 40,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
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
