import { expect, test } from 'vitest';

import { birthDateOf, lifeTimeAt } from './age';
import { HOURS_PER_YEAR } from './constants';
import { formatBirthDate, formatLifeTime } from './format';

test('the player was born 18 years before the day the game is launched', () => {
  const birthDate = birthDateOf(new Date(2026, 9, 4));
  expect(birthDate).toBe('2008-10-04');
  expect(formatBirthDate(birthDate)).toBe('4 October 2008');
});

test('the life time is split in years and days', () => {
  expect(lifeTimeAt(0)).toEqual({ years: 0, days: 0 });
  expect(lifeTimeAt(HOURS_PER_YEAR + 3 * 24 + 5)).toEqual({
    years: 1,
    days: 3,
  });
});

test('the life time is shown without empty years', () => {
  expect(formatLifeTime({ years: 0, days: 12 })).toBe('12 d');
  expect(formatLifeTime({ years: 2, days: 0 })).toBe('2 y 0 d');
});
