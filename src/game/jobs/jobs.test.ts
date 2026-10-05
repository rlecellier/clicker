import { expect, test } from 'vitest';

import {
  hireAt,
  isJobId,
  JOB_IDS,
  nextShiftAfter,
  shiftAt,
  shiftsOnDay,
} from './jobs';

const SELLER = hireAt('clothes-seller', 0);

test('the clothes seller is the only job for now', () => {
  expect(JOB_IDS).toEqual(['clothes-seller']);
  expect(isJobId('clothes-seller')).toBe(true);
  expect(isJobId('astronaut')).toBe(false);
});

test('is hired at a given game hour', () => {
  expect(hireAt('clothes-seller', 30)).toEqual({
    id: 'clothes-seller',
    since: 30,
  });
});

test('no job, no shift', () => {
  expect(shiftsOnDay(undefined, 0)).toEqual([]);
  expect(shiftAt(undefined, 9)).toBeUndefined();
  expect(nextShiftAfter(undefined, 0)).toBeUndefined();
});

test('the shifts are the weekday mornings and afternoons', () => {
  expect(shiftsOnDay(SELLER, 0)).toHaveLength(2);
  expect(shiftsOnDay(SELLER, 5)).toEqual([]);
});

test('the days before the job was taken have no shift', () => {
  const hired = hireAt('clothes-seller', 2 * 24 + 10);
  expect(shiftsOnDay(hired, 1)).toEqual([]);
  expect(shiftsOnDay(hired, 2)).toHaveLength(2);
});

test('a shift runs from its start up to, not including, its end', () => {
  expect(shiftAt(SELLER, 8)?.id).toBe('work-morning');
  expect(shiftAt(SELLER, 11.5)?.id).toBe('work-morning');
  expect(shiftAt(SELLER, 12)).toBeUndefined();
  expect(shiftAt(SELLER, 13)?.id).toBe('work-afternoon');
  expect(shiftAt(SELLER, 5 * 24 + 9)).toBeUndefined();
});

test('the next shift can be tomorrow or after the weekend', () => {
  expect(nextShiftAfter(SELLER, 9)).toMatchObject({
    day: 0,
    shift: { id: 'work-afternoon' },
  });
  expect(nextShiftAfter(SELLER, 18)).toMatchObject({
    day: 1,
    shift: { id: 'work-morning' },
  });
  expect(nextShiftAfter(SELLER, 4 * 24 + 18)).toMatchObject({ day: 7 });
});
