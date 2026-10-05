import { expect, test } from 'vitest';

import { formatCoins } from './format';

test('shows small amounts in full', () => {
  expect(formatCoins(0)).toBe('0');
  expect(formatCoins(5)).toBe('5');
  expect(formatCoins(1250)).toBe('1,250');
  expect(formatCoins(9999)).toBe('9,999');
});

test('abbreviates thousands, millions and billions', () => {
  expect(formatCoins(10_000)).toBe('10K');
  expect(formatCoins(12_500)).toBe('12.5K');
  expect(formatCoins(2_350_000)).toBe('2.35M');
  expect(formatCoins(1_000_000_000)).toBe('1B');
});
