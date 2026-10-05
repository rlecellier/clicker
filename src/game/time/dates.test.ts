import { expect, test } from 'vitest';

import {
  dateOfDay,
  dayOfMonth,
  gameStartOf,
  monthLabel,
  weekdayIndex,
  weekdayLabel,
} from './dates';

// Monday 5 October 2026, local time.
const MONDAY = new Date(2026, 9, 5, 0, 0);

test('a game starts on the Monday of the week of the player', () => {
  const start = gameStartOf(new Date(2026, 9, 7, 14, 45));
  expect(start.origin).toBe(Date.UTC(2026, 9, 5));
  // Wednesday 14:30: two days and a half, the quarter hour is dropped
  expect(start.startHours).toBe(2 * 24 + 14.5);
});

test('a game started on a Monday midnight has no offset', () => {
  expect(gameStartOf(MONDAY)).toEqual({
    origin: Date.UTC(2026, 9, 5),
    startHours: 0,
  });
});

test('a Sunday belongs to the week that began the Monday before', () => {
  const start = gameStartOf(new Date(2026, 9, 11, 23, 59));
  expect(start.origin).toBe(Date.UTC(2026, 9, 5));
  expect(start.startHours).toBe(6 * 24 + 23.5);
});

test('days are counted from the origin', () => {
  const { origin } = gameStartOf(MONDAY);
  expect(dateOfDay(origin, 0).getUTCDate()).toBe(5);
  expect(weekdayLabel(origin, 0)).toBe('Mon');
  expect(weekdayLabel(origin, 6)).toBe('Sun');
  expect(weekdayLabel(origin, 7)).toBe('Mon');
  expect(dayOfMonth(origin, 27)).toBe(1);
  expect(monthLabel(origin, 27)).toBe('Nov');
  expect(weekdayIndex(9)).toBe(2);
});
