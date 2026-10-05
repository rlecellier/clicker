import { expect, test } from 'vitest';

import {
  dayOfMonth,
  gameStartOf,
  monthLabel,
  weekdayIndex,
  weekdayLabel,
  yearOf,
} from './dates';

// Monday 5 October 2026, local time.
const MONDAY = new Date(2026, 9, 5, 0, 0);

test('a game starts at 08:00 the next morning, in the week of that day', () => {
  const start = gameStartOf(new Date(2026, 9, 7, 14, 45));
  expect(start.origin).toBe(Date.UTC(2026, 9, 5));
  // launched on Wednesday, it starts on Thursday 08:00
  expect(start.startHours).toBe(3 * 24 + 8);
});

test('a game launched on a Monday starts on the Tuesday', () => {
  expect(gameStartOf(MONDAY)).toEqual({
    origin: Date.UTC(2026, 9, 5),
    startHours: 24 + 8,
  });
});

test('a game launched on a Sunday starts on the Monday of the next week', () => {
  const start = gameStartOf(new Date(2026, 9, 11, 23, 59));
  expect(start.origin).toBe(Date.UTC(2026, 9, 12));
  expect(start.startHours).toBe(8);
});

test('days are counted from the origin', () => {
  const { origin } = gameStartOf(MONDAY);
  expect(weekdayLabel(origin, 0)).toBe('Mon');
  expect(weekdayLabel(origin, 6)).toBe('Sun');
  expect(weekdayLabel(origin, 7)).toBe('Mon');
  expect(weekdayIndex(9)).toBe(2);
});

test('a week is a month and a year is 12 weeks', () => {
  const { origin } = gameStartOf(MONDAY);
  // week 0 is October 2026, its 7 days are numbered 1 to 7
  expect(monthLabel(origin, 0)).toBe('Oct');
  expect(dayOfMonth(origin, 0)).toBe(1);
  expect(dayOfMonth(origin, 6)).toBe(7);
  expect(yearOf(origin, 6)).toBe(2026);
  // week 1 is November, week 3 is January 2027
  expect(monthLabel(origin, 7)).toBe('Nov');
  expect(dayOfMonth(origin, 7)).toBe(1);
  expect(monthLabel(origin, 27)).toBe('Jan');
  expect(dayOfMonth(origin, 27)).toBe(7);
  expect(yearOf(origin, 20)).toBe(2026);
  expect(yearOf(origin, 21)).toBe(2027);
  // 12 weeks later it is the same month, a year later
  expect(monthLabel(origin, 12 * 7)).toBe('Oct');
  expect(yearOf(origin, 12 * 7)).toBe(2027);
  expect(weekdayIndex(9)).toBe(2);
});
