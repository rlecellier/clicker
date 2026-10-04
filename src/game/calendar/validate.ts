import type { CalendarEvent, Recurrence } from './types';

const KINDS = new Set(['work', 'meal', 'sleep', 'read']);
const MODES = new Set(['auto', 'ask']);

const isHour = (value: unknown) =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= 24;

const isRecurrence = (value: unknown): value is Recurrence => {
  if (typeof value !== 'object' || value === null) return false;
  const recurrence = value as Record<string, unknown>;
  return recurrence.type === 'once'
    ? Number.isSafeInteger(recurrence.day) && (recurrence.day as number) >= 0
    : recurrence.type === 'weekly' &&
        Array.isArray(recurrence.days) &&
        recurrence.days.every(
          (day) => Number.isSafeInteger(day) && day >= 0 && day < 7,
        );
};

// An event of a save comes from outside: it is checked before it is played.
export const isCalendarEvent = (value: unknown): value is CalendarEvent => {
  if (typeof value !== 'object' || value === null) return false;
  const event = value as Record<string, unknown>;
  return (
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    KINDS.has(event.kind as string) &&
    MODES.has(event.mode as string) &&
    isRecurrence(event.recurrence) &&
    isHour(event.start) &&
    isHour(event.end) &&
    (event.start as number) < (event.end as number) &&
    (event.calories === undefined || typeof event.calories === 'number')
  );
};
