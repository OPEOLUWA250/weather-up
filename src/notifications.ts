import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { formatTemp } from './format';
import { PHRASES } from './i18n';
import { Language, Unit, Weather } from './types';

// The morning alert: a notification at 7 AM with the day's forecast.
//
// A scheduled notification's text is fixed when it's scheduled. So every time
// the app loads fresh weather, we cancel the old alerts and schedule new ones
// for the next few mornings, using each day's own forecast.

const CHANNEL_ID = 'morning-alert';
const ALERT_HOUR = 7; // 7 AM, on the phone's clock
const MORNINGS_AHEAD = 3; // Forecasts further ahead are less reliable

// Show notifications even while the app is open. Called once, in _layout.tsx.
export function setUpNotifications(): void {
  Notifications.setNotificationHandler({
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
  // Android 8+ groups notifications into "channels" the user can control.
  // On Android 13+, the permission pop-up only appears once a channel exists.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Morning weather alert',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleMorningAlerts(
  weather: Weather,
  language: Language,
  unit: Unit,
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const say = PHRASES[language];
  const now = new Date();

  for (const day of weather.daily.slice(0, MORNINGS_AHEAD + 1)) {
    const [year, month, date] = day.date.split('-').map(Number);
    // Here we DO want the phone's own clock: "7 AM where I am".
    const alertTime = new Date(year, month - 1, date, ALERT_HOUR, 0);
    if (alertTime <= now) continue; // This morning has already passed

    await Notifications.scheduleNotificationAsync({
      content: {
        title: say.morningTitle(weather.city),
        body: say.morningBody(formatTemp(day.low, unit), formatTemp(day.high, unit), day.rainChance),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: alertTime,
        channelId: CHANNEL_ID,
      },
    });
  }
}

export function cancelMorningAlerts(): Promise<void> {
  return Notifications.cancelAllScheduledNotificationsAsync();
}

// Sends a notification right away, so you can see what alerts look like.
export async function sendTestAlert(language: Language): Promise<void> {
  const say = PHRASES[language];
  await Notifications.scheduleNotificationAsync({
    content: {
      title: say.morningTitle('Weather Up'),
      body: say.morningBody('26°', '31°', 80),
    },
    trigger: null, // null = show it now
  });
}
