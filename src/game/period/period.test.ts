import { expect, test } from 'vitest';

import { HOURS_PER_DAY, HOURS_PER_WEEK } from '@game/time';

import { periodRange } from './period';

test('the week starts on the Monday of the current week', () => {
  const now = 2 * HOURS_PER_WEEK + 50;
  expect(periodRange('week', now)).toEqual({
    from: 2 * HOURS_PER_WEEK,
    to: now,
  });
});

test('the month and the year start with the game on its first day', () => {
  const now = 10;
  expect(periodRange('month', now).from).toBe(0);
  expect(periodRange('year', now).from).toBe(0);
});

test('the month restarts on the first day of the next month', () => {
  // the game starts on 1 February 2027 (28 days): 1 March is day 28
  const now = 30 * HOURS_PER_DAY;
  expect(periodRange('month', now)).toEqual({
    from: 28 * HOURS_PER_DAY,
    to: now,
  });
  expect(periodRange('year', now).from).toBe(0);
});

test('the year restarts on 1 January', () => {
  // 1 January 2028 is day 334 of the game (28 + 31 + 30 + 31 + 30 + 31 +
  // 31 + 30 + 31 + 30 + 31)
  const now = 340 * HOURS_PER_DAY;
  expect(periodRange('year', now).from).toBe(334 * HOURS_PER_DAY);
  expect(periodRange('month', now).from).toBe(334 * HOURS_PER_DAY);
});
