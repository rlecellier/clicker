import type { CalendarEvent } from './types';

const WEEKDAYS = [0, 1, 2, 3, 4];

export const EVENTS: CalendarEvent[] = [
  { id: 'work-morning', title: 'Work', days: WEEKDAYS, start: 8, end: 12 },
  { id: 'work-afternoon', title: 'Work', days: WEEKDAYS, start: 13, end: 18 },
];
