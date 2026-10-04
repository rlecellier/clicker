import { expect, test } from 'vitest';

import { DEFAULT_PLAN } from './events';

test('sleeps 8 hours a day, from 23:00 to 7:00', () => {
  const sleep = DEFAULT_PLAN.filter((event) => event.kind === 'sleep');
  const hours = sleep.reduce(
    (total, event) => total + event.end - event.start,
    0,
  );
  expect(hours).toBe(8);
  expect(Math.min(...sleep.map((event) => event.start))).toBe(0);
  expect(Math.max(...sleep.map((event) => event.end))).toBe(24);
});

test('every event of the default plan starts by itself and repeats', () => {
  expect(DEFAULT_PLAN.every((event) => event.mode === 'auto')).toBe(true);
  expect(
    DEFAULT_PLAN.every((event) => event.recurrence.type === 'weekly'),
  ).toBe(true);
});
