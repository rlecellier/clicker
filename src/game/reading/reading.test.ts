import { expect, test } from 'vitest';

import { HOURS_PER_DAY } from '@game/time';

import { BOOKS, complexityOf, getBook, hoursToRead } from './books';
import {
  INITIAL_READING,
  isFreeTime,
  isLibraryRead,
  readingHoursBetween,
  stepReading,
  toggleReading,
} from './reading';
import type { Reading } from './types';

const at = (day: number, hour: number) => day * HOURS_PER_DAY + hour;
const bookOf = (id: string) => {
  const book = getBook(id);
  if (!book) throw new Error(`unknown book ${id}`);
  return book;
};
const FIRST = bookOf('animal-farm');
const SECOND = bookOf('little-prince');
const READING: Reading = {
  ...INITIAL_READING,
  bookId: FIRST.id,
  isReading: true,
};

test('the catalog has many distinct books', () => {
  expect(BOOKS.length).toBeGreaterThanOrEqual(40);
  expect(new Set(BOOKS.map((book) => book.id)).size).toBe(BOOKS.length);
});

test('the longer the book, the more complex and the longer to read', () => {
  expect(complexityOf(100)).toBe(1);
  expect(complexityOf(1200)).toBe(5);
  const byPages = BOOKS.toSorted((a, b) => a.pages - b.pages);
  for (const [index, book] of byPages.entries()) {
    const next = byPages[index + 1];
    if (!next) continue;
    expect(next.complexity).toBeGreaterThanOrEqual(book.complexity);
    expect(next.hours).toBeGreaterThanOrEqual(book.hours);
  }
  // a heavy book takes more than its pages alone would
  expect(hoursToRead(1000)).toBeGreaterThan(hoursToRead(500) * 2);
});

test('free time is when nothing is scheduled', () => {
  expect(isFreeTime(at(0, 18.5))).toBe(true);
  expect(isFreeTime(at(0, 10))).toBe(false);
  expect(isFreeTime(at(0, 12.5))).toBe(false);
  expect(isFreeTime(at(0, 2))).toBe(false);
  // no work at the weekend
  expect(isFreeTime(at(5, 10))).toBe(true);
});

test('the roll draws the book among the unread ones', () => {
  expect(toggleReading(INITIAL_READING, 0).bookId).toBe(FIRST.id);
  expect(toggleReading(INITIAL_READING, 0.999).bookId).toBe(BOOKS.at(-1)?.id);
  const started = toggleReading(
    { ...INITIAL_READING, readBookIds: [FIRST.id] },
    0,
  );
  expect(started.bookId).toBe(SECOND.id);
  expect(started.isReading).toBe(true);
});

test('the book does not move unless the player reads', () => {
  const paused = { ...READING, isReading: false };
  expect(stepReading(paused, at(0, 18), at(0, 19))).toEqual(paused);
  expect(stepReading(INITIAL_READING, at(0, 18), at(0, 19))).toEqual(
    INITIAL_READING,
  );
});

test('the book moves during free time only', () => {
  // Monday 08:00 to 20:00: only 18:00 to 19:00 is free
  expect(stepReading(READING, at(0, 8), at(0, 20)).bookHours).toBeCloseTo(1, 5);
  expect(stepReading(READING, at(0, 8), at(0, 12)).bookHours).toBe(0);
});

test('only the hours that finish the book count', () => {
  const state = { ...READING, bookHours: FIRST.hours - 0.5 };
  expect(readingHoursBetween(state, at(5, 8), at(5, 12))).toBe(0.5);
});

test('a finished book goes to the read ones and frees the player', () => {
  const last = { ...READING, bookHours: FIRST.hours - 0.5 };
  expect(stepReading(last, at(5, 8), at(5, 12))).toEqual({
    bookId: undefined,
    bookHours: 0,
    readBookIds: [FIRST.id],
    isReading: false,
  });
});

test('reading can be paused and resumed', () => {
  const paused = toggleReading(READING, 0.5);
  expect(paused.isReading).toBe(false);
  expect(paused.bookId).toBe(FIRST.id);
  const resumed = toggleReading({ ...paused, bookHours: 2 }, 0.9);
  expect(resumed).toEqual({ ...READING, bookHours: 2 });
});

test('nothing to read once every book is read', () => {
  const all = { ...INITIAL_READING, readBookIds: BOOKS.map((book) => book.id) };
  expect(isLibraryRead(all)).toBe(true);
  expect(toggleReading(all, 0.5)).toBe(all);
  expect(getBook(FIRST.id)).toBe(FIRST);
});
