// Turns "2026-10-16T09:00" into "9 AM".
//
// We read the hour straight from the text instead of using `new Date()`.
// The API gives the CITY's local time, but `new Date()` would assume the
// PHONE's time zone, which shows the wrong hours for cities elsewhere.
export function formatHour(isoTime: string): string {
  const hour = Number(isoTime.slice(11, 13)); // Characters 11-12 are the hour: "09" → 9
  const suffix = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12; // 0 → 12 AM, 13 → 1 PM
  return `${hour12} ${suffix}`;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Turns "2026-10-16" into "Fri".
export function formatDay(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number); // "2026-10-16" → [2026, 10, 16]
  // Date.UTC + getUTCDay keep the phone's time zone out of it (see formatHour).
  // Months start at 0 in JavaScript (January = 0), hence `month - 1`.
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0 = Sunday
  return DAY_NAMES[weekday];
}
