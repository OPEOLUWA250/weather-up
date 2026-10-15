import { FlatList, StyleSheet, Text, View } from 'react-native';

import { formatHour, formatTemp } from '../format';
import { HourForecast, Unit } from '../types';
import { Card } from './Card';
import { Icon } from './Icon';

interface HourlyForecastProps {
  hours: HourForecast[];
  unit: Unit;
}

export function HourlyForecast({ hours, unit }: HourlyForecastProps) {
  return (
    <Card title="Hourly forecast" icon="clock">
      {/* FlatList draws a list from an array. `horizontal` makes it scroll sideways. */}
      <FlatList
        data={hours}
        keyExtractor={(hour) => hour.time} // A unique key for each item
        horizontal
        showsHorizontalScrollIndicator={false}
        overScrollMode="never" // Android: no stretch effect at the ends
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.hour}>
            <Text style={styles.time}>{index === 0 ? 'Now' : formatHour(item.time)}</Text>
            <Icon name={item.icon} size={22} color="#fff" style={styles.hourIcon} />
            <Text style={styles.temperature}>{formatTemp(item.temperature, unit)}</Text>
          </View>
        )}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 8,
  },
  hour: {
    width: 64,
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  hourIcon: {
    marginVertical: 10,
  },
  temperature: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
