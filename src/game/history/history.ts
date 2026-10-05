import { HOURS_PER_DAY } from '@game/time';

import type { DayEntry, DoneEntry } from './types';

// Adds what has just been done. Doing the same thing again right away
// (working or sleeping several times in a row) extends the last entry instead
// of adding a new one.
export const recordDone = (
  history: DoneEntry[],
  done: DoneEntry,
): DoneEntry[] => {
  const last = history.at(-1);
  return last?.kind === done.kind &&
    last.title === done.title &&
    last.end === done.start
    ? [...history.slice(0, -1), { ...last, end: done.end }]
    : [...history, done];
};

// The entries of one day of the game. An entry that goes over midnight is cut
// at the end of the day, and continues on the next.
export const doneOnDay = <T extends DoneEntry>(
  history: T[],
  day: number,
): DayEntry<T>[] => {
  const dayStart = day * HOURS_PER_DAY;
  const dayEnd = dayStart + HOURS_PER_DAY;
  return history
    .filter((entry) => entry.start < dayEnd && entry.end > dayStart)
    .map((entry) => ({
      ...entry,
      id: `${entry.kind}@${entry.start}`,
      start: Math.max(entry.start, dayStart) - dayStart,
      end: Math.min(entry.end, dayEnd) - dayStart,
    }));
};

// Hours spent on a kind of action, all history long.
export const hoursDone = (history: DoneEntry[], kind: DoneEntry['kind']) =>
  history
    .filter((entry) => entry.kind === kind)
    .reduce((total, entry) => total + entry.end - entry.start, 0);
