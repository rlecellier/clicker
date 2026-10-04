import type { CalendarEvent, Recurrence } from './types';

const EVERY_DAY: Recurrence = {
  type: 'weekly',
  days: [0, 1, 2, 3, 4, 5, 6],
};

// What the player plans to do from the start: sleep and eat.
export const DEFAULT_PLAN: CalendarEvent[] = [
  // The night from 23:00 to 7:00 is split at midnight: an event stays inside
  // one day.
  {
    id: 'sleep-night',
    title: 'Sleep',
    kind: 'sleep',
    mode: 'auto',
    recurrence: EVERY_DAY,
    start: 0,
    end: 7,
  },
  {
    id: 'breakfast',
    title: 'Breakfast',
    kind: 'meal',
    mode: 'auto',
    recurrence: EVERY_DAY,
    start: 7,
    end: 7.5,
    calories: 15,
  },
  {
    id: 'lunch',
    title: 'Lunch',
    kind: 'meal',
    mode: 'auto',
    recurrence: EVERY_DAY,
    start: 12,
    end: 13,
    calories: 21,
  },
  {
    id: 'dinner',
    title: 'Dinner',
    kind: 'meal',
    mode: 'auto',
    recurrence: EVERY_DAY,
    start: 19,
    end: 20,
    calories: 21,
  },
  {
    id: 'sleep-evening',
    title: 'Sleep',
    kind: 'sleep',
    mode: 'auto',
    recurrence: EVERY_DAY,
    start: 23,
    end: 24,
  },
];
