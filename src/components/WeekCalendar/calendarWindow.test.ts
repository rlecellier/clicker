import { expect, test } from 'vitest';

import {
  calendarWindow,
  COLUMNS_AFTER,
  COLUMNS_BEFORE,
} from './calendarWindow';

test('starts on the current day', () => {
  expect(calendarWindow(0, 0).firstDay).toBe(0);
  expect(calendarWindow(1, 24 * 2 + 5).firstDay).toBe(9);
});

test('keeps columns around the seven visible days', () => {
  const { firstDay, columns } = calendarWindow(1, 0);
  expect(columns).toHaveLength(COLUMNS_BEFORE + 7 + COLUMNS_AFTER);
  expect(columns[0]).toBe(firstDay - COLUMNS_BEFORE);
});

test('has no column before the first day of the game', () => {
  expect(calendarWindow(0, 0).columns[0]).toBe(0);
});

test('names the month, or both when the week spans two', () => {
  expect(calendarWindow(0, 0).monthLabel).toBe('Feb');
  // 25 February 2027 to 3 March 2027
  expect(calendarWindow(3, 24 * 3).monthLabel).toBe('Feb – Mar');
});
