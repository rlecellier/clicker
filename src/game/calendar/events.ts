import type { CalendarEvent } from './types';

const WEEKDAYS = [0, 1, 2, 3, 4];
const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

export const EVENTS: CalendarEvent[] = [
  // The night from 23:00 to 7:00 is split at midnight: an event stays inside
  // one day.
  {
    id: 'sleep-night',
    title: 'Sleep',
    kind: 'sleep',
    days: EVERY_DAY,
    start: 0,
    end: 7,
  },
  {
    id: 'breakfast',
    title: 'Breakfast',
    kind: 'meal',
    days: EVERY_DAY,
    start: 7,
    end: 7.5,
    calories: 15,
  },
  {
    id: 'work-morning',
    title: 'Work',
    kind: 'work',
    days: WEEKDAYS,
    start: 8,
    end: 12,
  },
  {
    id: 'lunch',
    title: 'Lunch',
    kind: 'meal',
    days: EVERY_DAY,
    start: 12,
    end: 13,
    calories: 25,
  },
  {
    id: 'work-afternoon',
    title: 'Work',
    kind: 'work',
    days: WEEKDAYS,
    start: 13,
    end: 18,
  },
  {
    id: 'dinner',
    title: 'Dinner',
    kind: 'meal',
    days: EVERY_DAY,
    start: 19,
    end: 20,
    calories: 25,
  },
  {
    id: 'sleep-evening',
    title: 'Sleep',
    kind: 'sleep',
    days: EVERY_DAY,
    start: 23,
    end: 24,
  },
];
