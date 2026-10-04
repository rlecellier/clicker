import { expect, test } from 'vitest';

import { locationAt } from './location';

test('is at the office during work hours', () => {
  expect(locationAt(9)).toBe('office');
});

test('is at the restaurant during a meal', () => {
  expect(locationAt(12.5)).toBe('restaurant');
});

test('is at home when nothing is scheduled or asleep', () => {
  expect(locationAt(3)).toBe('home');
  expect(locationAt(18.5)).toBe('home');
});

test('is at home on the weekend during work hours', () => {
  expect(locationAt(5 * 24 + 9)).toBe('home');
});
