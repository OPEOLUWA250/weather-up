import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { setUpNotifications } from '../notifications';
import { SettingsProvider } from '../settings';
import { warmUpSpeech } from '../speech';

// Expo Router: every file in src/app/ is a screen, and its name is its URL:
//   src/app/index.tsx    → "/"         (home)
//   src/app/settings.tsx → "/settings"
// This _layout.tsx file wraps ALL of them.

setUpNotifications();

export default function RootLayout() {
  // Wake up the text-to-speech engine early, so "Read aloud" starts instantly.
  useEffect(() => {
    warmUpSpeech();
  }, []);

  return (
    <SafeAreaProvider>
      {/* Every screen inside can call useSettings() */}
      <SettingsProvider>
        {/* A Stack: new screens slide in on top, and "back" slides them away */}
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#4A90E2' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '600' },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        </Stack>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
