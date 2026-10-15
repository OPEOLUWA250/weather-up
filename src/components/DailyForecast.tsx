import { StyleSheet, Text, View } from 'react-native';

import { formatDay } from '../format';
import { DayForecast } from '../types';
import { Card } from './Card';
import { Icon } from './Icon';

interface DailyForecastProps {
  days: DayForecast[];
}

export function DailyForecast({ days }: DailyForecastProps) {
  // The coldest and hottest temperatures of the whole week.
  // `...` (spread) turns the array into separate arguments: Math.min(25, 26, 24, ...)
  const weekLow = Math.min(...days.map((day) => day.low));
  const weekHigh = Math.max(...days.map((day) => day.high));
  const weekRange = Math.max(weekHigh - weekLow, 1); // Never 0, so we can divide by it

  return (
    <Card title="7-day forecast" icon="calendar-days">
      {/* Only 7 items, so a simple .map() is fine. (A vertical FlatList inside
          our vertical ScrollView would also cause a React Native warning.) */}
      {days.map((day, index) => {
        // Where the bar starts and how long it is, as a % of the week's range.
        const barStart = ((day.low - weekLow) / weekRange) * 100;
        const barWidth = ((day.high - day.low) / weekRange) * 100;

        return (
          <View key={day.date} style={[styles.row, index > 0 && styles.rowDivider]}>
            <Text style={styles.day}>{index === 0 ? 'Today' : formatDay(day.date)}</Text>

            <View style={styles.iconColumn}>
              <Icon name={day.icon} size={20} color="#fff" />
            </View>

            <View style={styles.rainColumn}>
              {day.rainChance > 0 && (
                <>
                  <Icon name="droplet" size={10} color="#A8D8FF" />
                  <Text style={styles.rain}>{day.rainChance}%</Text>
                </>
              )}
            </View>

            <Text style={styles.low}>{day.low}°</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { left: `${barStart}%`, width: `${barWidth}%` }]} />
            </View>
            <Text style={styles.high}>{day.high}°</Text>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 16,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  day: {
    width: 52,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  iconColumn: {
    width: 32,
    alignItems: 'center',
  },
  rainColumn: {
    width: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rain: {
    marginLeft: 3,
    fontSize: 12,
    color: '#A8D8FF',
  },
  low: {
    width: 32,
    textAlign: 'right',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  barTrack: {
    flex: 1, // Take up all the leftover space in the row
    height: 4,
    marginHorizontal: 8,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  barFill: {
    position: 'absolute', // Placed with left/width inside the track
    top: 0,
    bottom: 0,
    borderRadius: 2,
    backgroundColor: '#FFD54F',
  },
  high: {
    width: 32,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
