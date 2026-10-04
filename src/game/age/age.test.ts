import { expect, test } from 'vitest';

import { ageAt } from './age';
import { HOURS_PER_YEAR, START_AGE } from './constants';

test('a new player is 18', () => {
  expect(START_AGE).toBe(18);
  expect(ageAt(0)).toBe(18);
});

test('the player gets a year older every 365 days', () => {
  expect(ageAt(HOURS_PER_YEAR - 1)).toBe(18);
  expect(ageAt(HOURS_PER_YEAR)).toBe(19);
  expect(ageAt(HOURS_PER_YEAR * 10)).toBe(28);
});
