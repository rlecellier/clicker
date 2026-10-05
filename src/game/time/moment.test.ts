import { expect, test } from 'vitest';

import { momentOf } from './moment';

// Monday 5 October 2026
const ORIGIN = Date.UTC(2026, 9, 5);

test('tells the date and the time of a game hour', () => {
  expect(momentOf(ORIGIN, 14.5)).toEqual({
    date: 'Mon 1 Oct 2026',
    time: '14:30',
  });
  expect(momentOf(ORIGIN, 2 * 24 + 7)).toEqual({
    date: 'Wed 3 Oct 2026',
    time: '07:00',
  });
});
