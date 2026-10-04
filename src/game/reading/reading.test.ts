import { expect, test } from 'vitest';

import { HOURS_PER_DAY } from '@game/time';

import { BOOK_HOURS } from './constants';
import {
  INITIAL_READING,
  isFreeTime,
  readingHoursBetween,
  stepReading,
  toggleReading,
} from './reading';
import type { Reading } from './types';

const at = (day: number, hour: number) => day * HOURS_PER_DAY + hour;
const READING: Reading = { bookHours: 0, isReading: true };

test('free time is when nothing is scheduled', () => {
  expect(isFreeTime(at(0, 18.5))).toBe(true);
  expect(isFreeTime(at(0, 10))).toBe(false);
  expect(isFreeTime(at(0, 12.5))).toBe(false);
  expect(isFreeTime(at(0, 2))).toBe(false);
  // no work at the weekend
  expect(isFreeTime(at(5, 10))).toBe(true);
});

test('the book does not move unless the player reads', () => {
  expect(stepReading(INITIAL_READING, at(0, 18), at(0, 19))).toEqual(
    INITIAL_READING,
  );
});

test('the book moves during free time only', () => {
  // Monday 08:00 to 20:00: only 18:00 to 19:00 is free
  expect(stepReading(READING, at(0, 8), at(0, 20)).bookHours).toBeCloseTo(1, 5);
  expect(stepReading(READING, at(0, 8), at(0, 12)).bookHours).toBe(0);
});

test('the book stops at its last page and reading stops with it', () => {
  const done = stepReading(READING, at(5, 7.5), at(6, 7));
  expect(done.bookHours).toBeLessThan(BOOK_HOURS);
  const last = stepReading(
    { ...READING, bookHours: 47.5 },
    at(5, 8),
    at(5, 12),
  );
  expect(last).toEqual({ bookHours: BOOK_HOURS, isReading: false });
  expect(readingHoursBetween(last, at(5, 8), at(5, 12))).toBe(0);
});

test('only the hours that finish the book count', () => {
  const state = { ...READING, bookHours: 47.5 };
  expect(readingHoursBetween(state, at(5, 8), at(5, 12))).toBe(0.5);
});

test('reading can be paused and resumed, not once the book is done', () => {
  const paused = toggleReading(READING);
  expect(paused.isReading).toBe(false);
  expect(toggleReading(paused).isReading).toBe(true);
  const finished = { bookHours: BOOK_HOURS, isReading: false };
  expect(toggleReading(finished)).toBe(finished);
});
