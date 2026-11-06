// DB timestamps are stored as UTC strings 'YYYY-MM-DD HH:MM:SS' (SQLite datetime('now')).
// The active window is expressed in the machine's LOCAL time. These helpers bridge the two.

export function toDbUtc(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Parses a DB UTC string back to a Date (absolute instant).
export function parseDbUtc(s) {
  if (!s) return null;
  return new Date(`${s.replace(' ', 'T')}Z`);
}

// UTC string for the start of the current LOCAL day — use to bound "today" quotas
// at local midnight regardless of the machine's timezone offset from UTC.
export function startOfLocalDayUtc(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return toDbUtc(d);
}

// Local wall-clock "HH:MM" for comparing against active_start / active_end.
export function localHHMM(now = new Date()) {
  const d = new Date(now);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function hhmmToMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function minutesSince(date, now = new Date()) {
  if (!date) return Infinity;
  return (now.getTime() - date.getTime()) / 60000;
}
