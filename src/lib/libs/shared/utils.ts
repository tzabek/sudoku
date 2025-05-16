/**
 * Creates a deep copy of the given object or value.
 *
 * This function serializes the input object to JSON and then deserializes it back,
 * effectively creating a new object with the same structure and values as the original.
 * It is suitable for cloning plain objects and arrays, but it may not work correctly
 * for objects with methods, circular references,
 * or non-serializable properties (e.g., functions, `undefined`, `Date`, `Map`, `Set`, etc.).
 */
export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Formats a given time in milliseconds into a human-readable string.
 *
 * The output format is `Dd HH:MM:SS`, where:
 * - `Dd` represents the number of days (only included if greater than 0).
 * - `HH` represents hours, padded to 2 digits.
 * - `MM` represents minutes, padded to 2 digits.
 * - `SS` represents seconds, padded to 2 digits.
 */
export function getFormattedTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${days > 0 ? `${days}d` : ''} ${pad(hours)}:${pad(minutes)}:${pad(
    seconds
  )}`;
}

/**
 * Generates a formatted date string including the year, month, day, and weekday.
 *
 * The format of the returned string is `YYYY-MM-DD Weekday`, where:
 * - `YYYY` is the 4-digit year.
 * - `MM` is the 2-digit month (zero-padded).
 * - `DD` is the 2-digit day of the month (zero-padded).
 * - `Weekday` is the short name of the day of the week (e.g., "Mon", "Tue").
 *
 * The weekday is determined based on the user's browser locale,
 * falling back to "en-GB" if the locale is unavailable.
 */
export function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const locale = navigator.language || 'en-GB';
  const weekday = now.toLocaleDateString(locale, { weekday: 'short' });

  return `${year}-${month}-${day} ${weekday}`;
}
