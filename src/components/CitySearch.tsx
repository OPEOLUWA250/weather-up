import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { searchCities } from '../api';
import { getCurrentCity } from '../location';
import { City } from '../types';
import { Icon } from './Icon';

interface CitySearchProps {
  // A function passed in by the parent (App). We call it when the user picks a city.
  onSelectCity: (city: City) => void;
}

export function CitySearch({ onSelectCity }: CitySearchProps) {
  const [query, setQuery] = useState(''); // What the user has typed
  const [results, setResults] = useState<City[]>([]); // Matching cities
  const [message, setMessage] = useState<string | null>(null); // e.g. "Searching..."

  async function handleSearch() {
    const trimmed = query.trim(); // Remove spaces at the start and end
    if (trimmed === '') return; // Nothing to search for

    Keyboard.dismiss(); // Hide the keyboard so the results are visible
    setResults([]);
    setMessage('Searching...');

    try {
      const cities = await searchCities(trimmed);
      setResults(cities);
      setMessage(cities.length === 0 ? `No cities found for "${trimmed}"` : null);
    } catch (error) {
      console.error('Could not search cities:', error);
      setMessage('Search failed. Check your internet connection.');
    }
  }

  function handleSelect(city: City) {
    onSelectCity(city); // Tell the parent which city was picked
    setQuery('');
    setResults([]);
    setMessage(null);
  }

  async function handleUseLocation() {
    Keyboard.dismiss();
    setResults([]);
    setMessage('Finding your location...');

    try {
      const city = await getCurrentCity();
      handleSelect(city); // Same as tapping a search result
    } catch (error) {
      // getCurrentCity throws errors with friendly messages, so we can show them.
      setMessage(error instanceof Error ? error.message : "Couldn't find your location.");
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholder="Search for a city..."
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="search"
          autoCorrect={false}
        />
        <Pressable
          onPress={handleSearch}
          accessibilityLabel="Search" // Read aloud by screen readers, since there's no text
          style={({ pressed }) => [styles.searchButton, pressed && styles.searchButtonPressed]}
        >
          <Icon name="magnifying-glass" size={18} color="#4A90E2" />
        </Pressable>
        <Pressable
          onPress={handleUseLocation}
          accessibilityLabel="Use my current location"
          style={({ pressed }) => [styles.searchButton, pressed && styles.searchButtonPressed]}
        >
          <Icon name="location-crosshairs" size={18} color="#4A90E2" />
        </Pressable>
      </View>

      {message !== null && <Text style={styles.message}>{message}</Text>}

      {results.length > 0 && (
        <View style={styles.results}>
          {results.map((city) => (
            <Pressable
              key={city.id}
              onPress={() => handleSelect(city)}
              style={({ pressed }) => [styles.resultRow, pressed && styles.resultRowPressed]}
            >
              <Text style={styles.resultName}>{city.name}</Text>
              <Text style={styles.resultDetail}>
                {[city.region, city.country].filter(Boolean).join(', ')}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  searchRow: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    width: 48,
    height: 48,
    marginLeft: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  searchButtonPressed: {
    opacity: 0.7,
  },
  message: {
    marginTop: 12,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  results: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  resultRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  resultRowPressed: {
    backgroundColor: '#F0F0F0',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  resultDetail: {
    marginTop: 2,
    fontSize: 14,
    color: '#666',
  },
});
