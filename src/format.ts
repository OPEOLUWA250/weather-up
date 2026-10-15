import { Unit } from './types';

// Turns a °C temperature into display text in the chosen unit: 26.6 → "27°" or "80°".
// All temperatures are stored in °C; we only convert at the last moment.
export function formatTemp(celsius: number, unit: Unit): string {
  const value = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}°`;
}

// Reads "HH" and "MM" out of "2026-10-16T06:52".
//
// We read the time straight from the text instead of using `new Date()`.
// The API gives the CITY's local time, but `new Date()` would assume the
// PHONE's time zone, which shows the wrong hours for cities elsewhere.
function readTime(isoTime: string): { hour: number; minute: number } {
  return {
    hour: Number(isoTime.slice(11, 13)), // Characters 11-12: "06" → 6
    minute: Number(isoTime.slice(14, 16)), // Characters 14-15: "52" → 52
  };
}

function to12Hour(hour: number): { hour12: number; suffix: string } {
  return {
    hour12: hour % 12 === 0 ? 12 : hour % 12, // 0 → 12 AM, 13 → 1 PM
    suffix: hour < 12 ? 'AM' : 'PM',
  };
}

// Turns "2026-10-16T09:00" into "9 AM".
export function formatHour(isoTime: string): string {
  const { hour12, suffix } = to12Hour(readTime(isoTime).hour);
  return `${hour12} ${suffix}`;
}

// Turns "2026-10-16T06:52" into "6:52 AM".
export function formatTime(isoTime: string): string {
  const { hour, minute } = readTime(isoTime);
  const { hour12, suffix } = to12Hour(hour);
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`; // 5 → "05"
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Turns "2026-10-16" into "Fri".
export function formatDay(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number); // "2026-10-16" → [2026, 10, 16]
  // Date.UTC + getUTCDay keep the phone's time zone out of it (see readTime).
  // Months start at 0 in JavaScript (January = 0), hence `month - 1`.
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0 = Sunday
  return DAY_NAMES[weekday];
}

// How long ago something happened, in words: "just now", "5 minutes ago", "2 days ago".
// Both arguments are timestamps in milliseconds (like Date.now()).
export function formatAge(then: number, now: number): string {
  const minutes = Math.floor((now - then) / 60_000); // 60,000 ms in a minute
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// UV index → a word. Scale from the World Health Organization.
export function uvLevel(uv: number): string {
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very high';
  return 'Extreme';
}

// US Air Quality Index → a word.
export function airQualityLevel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Poor for some';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very unhealthy';
  return 'Hazardous';
}
