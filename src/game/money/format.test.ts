import { expect, test } from 'vitest';

import { formatMoney } from './format';

test('shows whole dollars without cents', () => {
  expect(formatMoney(25_000)).toBe('$250');
  expect(formatMoney(0)).toBe('$0');
});

test('shows cents when there are some', () => {
  expect(formatMoney(22_581)).toBe('$225.81');
  expect(formatMoney(22_580)).toBe('$225.80');
});

test('can always show the cents', () => {
  expect(formatMoney(0, { alwaysCents: true })).toBe('$0.00');
  expect(formatMoney(1250, { alwaysCents: true })).toBe('$12.50');
});

test('abbreviates thousands, millions and billions', () => {
  expect(formatMoney(99_999)).toBe('$999.99');
  expect(formatMoney(100_000)).toBe('$1K');
  expect(formatMoney(150_000)).toBe('$1.5K');
  expect(formatMoney(100_000_000)).toBe('$1M');
  expect(formatMoney(235_000_000)).toBe('$2.35M');
  expect(formatMoney(100_000_000_000)).toBe('$1B');
});
