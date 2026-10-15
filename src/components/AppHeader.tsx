import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from './Icon';

// The top bar: logo and app name on the left, settings button on the right.
export function AppHeader() {
  // useRouter gives us functions to move between screens.
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* require() bundles the image file into the app */}
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Weather Up</Text>

      <Pressable
        onPress={() => router.push('/settings')} // Open src/app/settings.tsx
        accessibilityLabel="Settings"
        hitSlop={12}
        style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}
      >
        <Icon name="gear" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  title: {
    flex: 1, // Push the settings button to the far right
    marginLeft: 10,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  settingsButton: {
    padding: 6,
  },
  pressed: {
    opacity: 0.6,
  },
});
