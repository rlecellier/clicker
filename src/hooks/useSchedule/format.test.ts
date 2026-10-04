import { expect, test } from 'vitest';

import { formatClock, formatDuration } from './format';

test('formatClock writes an hour of the day as HH:MM', () => {
  expect(formatClock(7.5)).toBe('07:30');
  expect(formatClock(24)).toBe('00:00');
});

test('formatDuration writes minutes, hours, or both', () => {
  expect(formatDuration(0.5)).toBe('30 min');
  expect(formatDuration(3)).toBe('3h');
  expect(formatDuration(2.5)).toBe('2h 30');
});
