import { StyleSheet, Text, View } from 'react-native';

import { formatAge } from '../format';
import { Icon } from './Icon';

// Shown when there's no internet and we're displaying a saved forecast.
export function OfflineBanner({ savedAt }: { savedAt: number }) {
  return (
    <View style={styles.banner}>
      <Icon name="wifi" size={14} color="#2C3E50" />
      <Text style={styles.text}>
        Offline. Showing the forecast saved {formatAge(savedAt, Date.now())}. Pull down to try
        again.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  text: {
    flex: 1, // Let the text wrap next to the icon
    marginLeft: 10,
    fontSize: 14,
    color: '#2C3E50',
  },
});
