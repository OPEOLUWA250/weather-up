import { fireEvent, renderRouter, screen, testRouter, waitFor } from 'expo-router/testing-library';

// A "smoke test": renders the REAL screens from src/app with fake weather
// data, to catch crashes while drawing. Phone-only features are replaced
// with simple stand-ins ("mocks") because tests run on a computer.

// Rendering the whole app is slow the first time; allow up to 60 seconds per test.
jest.setTimeout(60_000);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
// Reanimated's mock needs Worklets mocked too, or it crashes while loading.
jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
// Moving animations can't be checked in a test, and expo-router's Reanimated
// mock is missing useReducedMotion, so the background animation is skipped.
jest.mock('./components/WeatherAnimation', () => ({ WeatherAnimation: () => null }));
jest.mock('expo-speech', () => ({
  getAvailableVoicesAsync: jest.fn(async () => []),
  speak: jest.fn(),
  stop: jest.fn(async () => {}),
}));
jest.mock('./notifications', () => ({
  alertsAvailable: true,
  setUpNotifications: jest.fn(),
  requestAlertPermission: jest.fn(async () => true),
  scheduleMorningAlerts: jest.fn(async () => {}),
  cancelMorningAlerts: jest.fn(async () => {}),
  sendTestAlert: jest.fn(async () => {}),
}));

// Fake answers from the weather and air quality APIs.
function forecastResponse() {
  const hours = Array.from({ length: 24 }, (_, i) => `2026-10-16T${String(i).padStart(2, '0')}:00`);
  const days = Array.from({ length: 7 }, (_, i) => `2026-10-${16 + i}`);
  return {
    current: {
      temperature_2m: 27.4,
      apparent_temperature: 33.4,
      relative_humidity_2m: 85,
      weather_code: 63, // Rain → exercises the rain animation
      wind_speed_10m: 12,
      is_day: 1,
    },
    hourly: {
      time: hours,
      temperature_2m: hours.map(() => 27),
      weather_code: hours.map(() => 63),
      is_day: hours.map(() => 1),
    },
    daily: {
      time: days,
      weather_code: days.map(() => 63),
      temperature_2m_max: days.map(() => 30),
      temperature_2m_min: days.map(() => 25),
      precipitation_probability_max: days.map(() => 80),
      uv_index_max: days.map(() => 8.4),
      sunrise: days.map((day) => `${day}T06:32`),
      sunset: days.map((day) => `${day}T18:31`),
    },
  };
}

function mockInternet(online: boolean) {
  globalThis.fetch = jest.fn(async (url: string) => {
    if (!online) throw new TypeError('Network request failed');
    const body = String(url).includes('air-quality')
      ? { current: { us_aqi: 92 } }
      : forecastResponse();
    return { ok: true, status: 200, json: async () => body };
  }) as unknown as typeof fetch;
}

test('home screen loads the weather and every card', async () => {
  mockInternet(true);
  renderRouter('./src/app');

  expect(await screen.findByText('Lagos, Nigeria')).toBeTruthy();
  expect(screen.getByText('Weather Up')).toBeTruthy();
  expect(screen.getByText('IN PLAIN WORDS')).toBeTruthy();
  expect(screen.getByText('TODAY')).toBeTruthy();
  expect(screen.getByText('Very high')).toBeTruthy(); // UV 8.4
  expect(screen.getByText('6:32 AM')).toBeTruthy(); // Sunrise
  expect(screen.getByText('HOURLY FORECAST')).toBeTruthy();
  expect(screen.getByText('7-DAY FORECAST')).toBeTruthy();
});

test('settings opens, and changing the language changes the summary', async () => {
  mockInternet(true);
  renderRouter('./src/app');
  await screen.findByText('Lagos, Nigeria');

  fireEvent.press(screen.getByLabelText('Settings'));
  expect(await screen.findByText('Naijá (Pidgin)')).toBeTruthy();
  fireEvent.press(screen.getByText('Naijá (Pidgin)'));

  testRouter.back();
  expect(await screen.findByText('SIMPLE TALK')).toBeTruthy();
});

test('offline: shows the saved forecast with a banner', async () => {
  // The tests above saved a forecast for Lagos. Now the internet is gone.
  mockInternet(false);
  renderRouter('./src/app');

  expect(await screen.findByText(/Offline\. Showing the forecast saved/)).toBeTruthy();
  await waitFor(() => expect(screen.getByText('Lagos, Nigeria')).toBeTruthy());
});
