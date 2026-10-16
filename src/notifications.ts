import type * as ExpoNotifications from 'expo-notifications';
// These two files only define plain values (enums), no native code, so they're safe to load.
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { Platform } from 'react-native';

import { formatTemp } from './format';
import { PHRASES } from './i18n';
import { Language, Unit, Weather } from './types';

// The morning alert: a notification at 7 AM with the day's forecast.
//
// A scheduled notification's text is fixed when it's scheduled. So every time
// the app loads fresh weather, we cancel the old alerts and schedule new ones
// for the next few mornings, using each day's own forecast.

// --- Loading expo-notifications safely ------------------------------------------------
//
// `import ... from 'expo-notifications'` loads the library's main file, which
// also loads its PUSH notification code. Expo Go on Android doesn't include
// that native code, so the import crashes the whole app with
// "Cannot find native module 'ExpoTopicSubscriptionModule'".
//
// So we load only the files for LOCAL notifications, which Expo Go supports.
// And if even those are missing, we switch the feature off instead of crashing.
// (`import type` above is only used for TypeScript types; it loads nothing.)

type NotificationsApi = Pick<
  typeof ExpoNotifications,
  | 'setNotificationHandler'
  | 'getPermissionsAsync'
  | 'requestPermissionsAsync'
  | 'setNotificationChannelAsync'
  | 'scheduleNotificationAsync'
  | 'cancelAllScheduledNotificationsAsync'
>;

let api: NotificationsApi | null = null;
try {
  api = {
    ...require('expo-notifications/build/NotificationsHandler'),
    ...require('expo-notifications/build/NotificationPermissions'),
    ...require('expo-notifications/build/setNotificationChannelAsync'),
    ...require('expo-notifications/build/scheduleNotificationAsync'),
    ...require('expo-notifications/build/cancelAllScheduledNotificationsAsync'),
  };
} catch (error) {
  console.warn('Notifications are not available in this version of the app:', error);
}

// false = this app can't show notifications (e.g. a limited Expo Go build).
export const alertsAvailable = api !== null;

// --- The alert itself -------------------------------------------------------------------

const CHANNEL_ID = 'morning-alert';
const ALERT_HOUR = 7; // 7 AM, on the phone's clock
const MORNINGS_AHEAD = 3; // Forecasts further ahead are less reliable

// Show notifications even while the app is open. Called once, in _layout.tsx.
export function setUpNotifications(): void {
  api?.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

// Asks the user for permission. Returns true if notifications are allowed.
export async function requestAlertPermission(): Promise<boolean> {
  if (api === null) return false;

  // Android 8+ groups notifications into "channels" the user can control.
  // On Android 13+, the permission pop-up only appears once a channel exists.
  if (Platform.OS === 'android') {
    await api.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Morning weather alert',
      importance: AndroidImportance.DEFAULT,
    });
  }

  const current = await api.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await api.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleMorningAlerts(
  weather: Weather,
  language: Language,
  unit: Unit,
): Promise<void> {
  if (api === null) return;
  await api.cancelAllScheduledNotificationsAsync();

  const say = PHRASES[language];
  const now = new Date();

  for (const day of weather.daily.slice(0, MORNINGS_AHEAD + 1)) {
    const [year, month, date] = day.date.split('-').map(Number);
    // Here we DO want the phone's own clock: "7 AM where I am".
    const alertTime = new Date(year, month - 1, date, ALERT_HOUR, 0);
    if (alertTime <= now) continue; // This morning has already passed

    await api.scheduleNotificationAsync({
      identifier: `morning-${day.date}`, // Our own readable ID, e.g. "morning-2026-10-17"
      content: {
        title: say.morningTitle(weather.city),
        body: say.morningBody(formatTemp(day.low, unit), formatTemp(day.high, unit), day.rainChance),
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: alertTime,
        channelId: CHANNEL_ID,
      },
    });
  }
}

export async function cancelMorningAlerts(): Promise<void> {
  await api?.cancelAllScheduledNotificationsAsync();
}

// Sends a notification right away, so you can see what alerts look like.
export async function sendTestAlert(language: Language): Promise<void> {
  if (api === null) return;
  const say = PHRASES[language];
  await api.scheduleNotificationAsync({
    identifier: 'test-alert',
    content: {
      title: say.morningTitle('Weather Up'),
      body: say.morningBody('26°', '31°', 80),
    },
    trigger: null, // null = show it now
  });
}
