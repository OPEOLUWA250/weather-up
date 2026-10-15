import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { cityKey, isSameCity } from '../cities';
import { City } from '../types';

interface FavouritesBarProps {
  favourites: City[];
  selectedCity: City;
  onSelect: (city: City) => void;
}

// A sideways-scrolling row of saved cities. Tap one to show its weather.
export function FavouritesBar({ favourites, selectedCity, onSelect }: FavouritesBarProps) {
  if (favourites.length === 0) {
    return <Text style={styles.hint}>Tap the star to save a city</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
      keyboardShouldPersistTaps="handled"
    >
      {favourites.map((city) => {
        const selected = isSameCity(city, selectedCity);
        return (
          <Pressable
            key={cityKey(city)}
            onPress={() => onSelect(city)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{city.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  chip: {
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  chipSelected: {
    backgroundColor: '#fff',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  chipTextSelected: {
    color: '#2C3E50',
  },
});
