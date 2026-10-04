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
