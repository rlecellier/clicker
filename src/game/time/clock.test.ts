import { expect, test } from 'vitest';

import { formatClock, formatDuration, parseClock } from './clock';

test('formatClock writes an hour of the day as HH:MM', () => {
  expect(formatClock(7.5)).toBe('07:30');
  expect(formatClock(24)).toBe('00:00');
});

test('formatDuration writes minutes, hours, or both', () => {
  expect(formatDuration(0.5)).toBe('30 min');
  expect(formatDuration(3)).toBe('3h');
  expect(formatDuration(2.5)).toBe('2h 30');
});

test('parseClock reads HH:MM back into an hour of the day', () => {
  expect(parseClock('07:30')).toBe(7.5);
  expect(parseClock('00:00')).toBe(0);
  expect(parseClock('23:59')).toBeCloseTo(23.983, 2);
});

test('parseClock refuses anything that is not a time of the day', () => {
  expect(parseClock('')).toBeUndefined();
  expect(parseClock('7:30')).toBeUndefined();
  expect(parseClock('24:00')).toBeUndefined();
  expect(parseClock('12:60')).toBeUndefined();
});
