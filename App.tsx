import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { fetchWeather } from './src/api';
import { Weather } from './src/types';

// Hard-coded for now. Later we'll use city search and GPS.
const CITY = { name: 'Lagos', latitude: 6.5244, longitude: 3.3792 };

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
  const [status, setStatus] = useState<Status>('loading');
  const [weather, setWeather] = useState<Weather | null>(null);

  // Defined here (not inside useEffect) so the "Try again" button can call it too.
  async function loadWeather() {
    setStatus('loading');
    try {
      const data = await fetchWeather(CITY.name, CITY.latitude, CITY.longitude);
      setWeather(data);
      setStatus('success');
    } catch (error) {
      console.error('Could not load weather:', error);
      setStatus('error');
    }
  }

  // Load the weather once, when the app starts.
  useEffect(() => {
    loadWeather();
  }, []);

  // 1. Loading: show a spinner.
  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.message}>Loading weather...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  // 2. Error: explain what happened and offer a retry.
  // (We also check `weather === null` so TypeScript knows it has data below.)
  if (status === 'error' || weather === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>⚠️</Text>
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
        <StatusBar style="light" />
      </View>
    );
  }

  // 3. Success: show the weather.
  return (
    <View style={styles.container}>
      <Text style={styles.city}>{weather.city}</Text>
      <Text style={styles.icon}>{weather.icon}</Text>
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

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  city: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  icon: {
    fontSize: 96,
    marginVertical: 8,
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
