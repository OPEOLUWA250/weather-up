import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatTemp } from '../format';
import { Unit, Weather } from '../types';
import { Icon } from './Icon';

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

interface CurrentWeatherProps {
  weather: Weather;
  unit: Unit;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

// The top part of the screen: city, big icon, temperature and details.
export function CurrentWeather({
  weather,
  unit,
  isFavourite,
  onToggleFavourite,
}: CurrentWeatherProps) {
  return (
    <>
      <View style={styles.cityRow}>
        <Text style={styles.city}>{weather.city}</Text>
        <Pressable
          onPress={onToggleFavourite}
          hitSlop={12} // Makes the small star easier to tap
          accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          style={styles.star}
        >
          {/* Filled yellow star when saved, outline star when not */}
          <Icon
            name="star"
            variant={isFavourite ? 'solid' : 'regular'}
            size={22}
            color={isFavourite ? '#FFD54F' : '#fff'}
          />
        </Pressable>
      </View>

      <Icon name={weather.icon} size={96} color="#fff" style={styles.icon} />
      <Text style={styles.temperature}>{formatTemp(weather.temperature, unit)}</Text>
      <Text style={styles.condition}>{weather.condition}</Text>
      <Text style={styles.highLow}>
        H: {formatTemp(weather.high, unit)}   L: {formatTemp(weather.low, unit)}
      </Text>

      <View style={styles.detailsCard}>
        <DetailItem label="Feels like" value={formatTemp(weather.feelsLike, unit)} />
        <DetailItem label="Humidity" value={`${weather.humidity}%`} />
        <DetailItem label="Wind" value={`${weather.windSpeed} km/h`} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  city: {
    flexShrink: 1, // Long names wrap instead of pushing the star off screen
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  star: {
    marginLeft: 12,
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
});
