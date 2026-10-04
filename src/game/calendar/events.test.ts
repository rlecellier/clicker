import { expect, test } from 'vitest';

import { EVENTS } from './events';

test('sleeps 8 hours a day, from 23:00 to 7:00', () => {
  const sleep = EVENTS.filter((event) => event.kind === 'sleep');
  const hours = sleep.reduce(
    (total, event) => total + event.end - event.start,
    0,
  );
  expect(hours).toBe(8);
  expect(Math.min(...sleep.map((event) => event.start))).toBe(0);
  expect(Math.max(...sleep.map((event) => event.end))).toBe(24);
});
