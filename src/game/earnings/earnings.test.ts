import { expect, test } from 'vitest';

import { isWorkHours, pendingPayCents, weeklyPayCents } from './earnings';

test('a week pays a quarter of the salary in a 28-day month', () => {
  expect(weeklyPayCents(0)).toBe(25_000);
});

test('a week pays less in a 31-day month', () => {
  // week 4 starts Monday March 1st
  expect(weeklyPayCents(4)).toBe(22_581);
});

test('nothing is earned before the first work hour', () => {
  expect(pendingPayCents(0, 7.9)).toBe(0);
});

test('pay grows during work hours and holds over lunch', () => {
  expect(pendingPayCents(0, 10)).toBeGreaterThan(0);
  expect(pendingPayCents(0, 12.5)).toBe(pendingPayCents(0, 12));
  expect(pendingPayCents(0, 15)).toBeGreaterThan(pendingPayCents(0, 12));
});

test('a full working week earns the whole weekly pay', () => {
  expect(pendingPayCents(0, 5 * 24)).toBe(25_000);
  expect(pendingPayCents(0, 168)).toBe(25_000);
});

test('works from 8h to 12h and 13h to 18h on weekdays', () => {
  expect(isWorkHours(8)).toBe(true);
  expect(isWorkHours(12.5)).toBe(false);
  expect(isWorkHours(13)).toBe(true);
  expect(isWorkHours(18)).toBe(false);
  expect(isWorkHours(5 * 24 + 9)).toBe(false);
});
