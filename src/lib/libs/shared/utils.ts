export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

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

export function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const locale = navigator.language || 'en-GB';
  const weekday = now.toLocaleDateString(locale, { weekday: 'short' });

  return `${year}-${month}-${day} ${weekday}`;
}
