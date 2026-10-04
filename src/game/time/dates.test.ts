import { expect, test } from 'vitest';

import {
  dateOfDay,
  dayOfMonth,
  daysInMonthOfWeek,
  weekdayIndex,
  weekdayLabel,
} from './dates';

test('the game starts on Monday 1 February 2027', () => {
  const start = dateOfDay(0);
  expect(start.getUTCFullYear()).toBe(2027);
  expect(start.getUTCMonth()).toBe(1);
  expect(start.getUTCDate()).toBe(1);
  expect(start.getUTCDay()).toBe(1);
});

test('counts the days of the month the week starts in', () => {
  expect(daysInMonthOfWeek(0)).toBe(28);
  // week 4 starts on Monday 1 March
  expect(daysInMonthOfWeek(4)).toBe(31);
});

test('labels a day with its weekday and its date', () => {
  expect(weekdayLabel(0)).toBe('Mon');
  expect(weekdayLabel(6)).toBe('Sun');
  expect(weekdayLabel(7)).toBe('Mon');
  expect(dayOfMonth(0)).toBe(1);
  expect(dayOfMonth(28)).toBe(1);
  expect(weekdayIndex(9)).toBe(2);
});
