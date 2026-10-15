import { StyleSheet, Text, View } from 'react-native';

import { airQualityLevel, formatTime, uvLevel } from '../format';
import { Weather } from '../types';
import { Card } from './Card';
import { Icon, IconName } from './Icon';

interface TileProps {
  icon: IconName;
  label: string;
  value: string;
  detail?: string;
}

// One square in the grid: icon + label, a big value, and an optional detail.
function Tile({ icon, label, value, detail }: TileProps) {
  return (
    <View style={styles.tile}>
      <View style={styles.tileHeader}>
        <Icon name={icon} size={12} color="rgba(255, 255, 255, 0.8)" />
        <Text style={styles.tileLabel}>{label}</Text>
      </View>
      <Text style={styles.tileValue}>{value}</Text>
      {detail !== undefined && <Text style={styles.tileDetail}>{detail}</Text>}
    </View>
  );
}

// UV index, air quality, sunrise and sunset, in a 2 × 2 grid.
export function TodayDetails({ weather }: { weather: Weather }) {
  return (
    <Card title="Today" icon="sun">
      <View style={styles.grid}>
        <Tile
          icon="sun"
          label="UV index"
          value={String(Math.round(weather.uvIndex))}
          detail={uvLevel(weather.uvIndex)}
        />
        <Tile
          icon="lungs"
          label="Air quality"
          value={weather.airQuality === null ? '–' : String(weather.airQuality)}
          detail={weather.airQuality === null ? 'Not available' : airQualityLevel(weather.airQuality)}
        />
        <Tile icon="arrow-up" label="Sunrise" value={formatTime(weather.sunrise)} />
        <Tile icon="arrow-down" label="Sunset" value={formatTime(weather.sunset)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Items that don't fit move to the next line → 2 per row
    paddingHorizontal: 8,
  },
  tile: {
    width: '50%',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileLabel: {
    marginLeft: 6,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tileValue: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  tileDetail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
