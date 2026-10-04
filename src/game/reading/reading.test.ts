import { expect, test } from 'vitest';

import { HOURS_PER_DAY } from '@game/time';
import { READING_SCHEDULE, WORKING_SCHEDULE } from '@test/schedules';

import { BOOKS, complexityOf, getBook, hoursToRead } from './books';
import {
  INITIAL_READING,
  isLibraryRead,
  isReadingAt,
  readingHoursBetween,
  startBook,
  stepReading,
} from './reading';

const at = (day: number, hour: number) => day * HOURS_PER_DAY + hour;
const bookOf = (id: string) => {
  const book = getBook(id);
  if (!book) throw new Error(`unknown book ${id}`);
  return book;
};
const FIRST = bookOf('animal-farm');
const SECOND = bookOf('little-prince');
// Reading events every evening from 20:00 to 23:00, the first book on the go.
const READER = { ...INITIAL_READING, ...READING_SCHEDULE, bookId: FIRST.id };

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

test('reads during a reading event only', () => {
  expect(isReadingAt(READING_SCHEDULE, at(0, 21))).toBe(true);
  expect(isReadingAt(READING_SCHEDULE, at(0, 18.5))).toBe(false);
  expect(isReadingAt(READING_SCHEDULE, at(0, 10))).toBe(false);
});

test('a reading event draws a book among the unread ones', () => {
  const reader = { ...INITIAL_READING, ...READING_SCHEDULE };
  expect(startBook(reader, at(0, 19), at(0, 21), 0).bookId).toBe(FIRST.id);
  expect(startBook(reader, at(0, 19), at(0, 21), 0.999).bookId).toBe(
    BOOKS.at(-1)?.id,
  );
  const next = { ...reader, readBookIds: [FIRST.id] };
  expect(startBook(next, at(0, 19), at(0, 21), 0).bookId).toBe(SECOND.id);
});

test('no book is drawn without a reading event, nor over the current one', () => {
  const reader = { ...INITIAL_READING, ...READING_SCHEDULE };
  expect(startBook(reader, at(0, 8), at(0, 12), 0).bookId).toBeUndefined();
  expect(startBook(READER, at(0, 19), at(0, 21), 0.999).bookId).toBe(FIRST.id);
});

test('the book does not move without a reading event or a book', () => {
  const idle = { ...READER, ...WORKING_SCHEDULE };
  expect(stepReading(idle, at(0, 18), at(0, 23)).bookHours).toBe(0);
  const none = { ...INITIAL_READING, ...READING_SCHEDULE };
  expect(stepReading(none, at(0, 18), at(0, 23))).toEqual(INITIAL_READING);
});

test('the book moves during the reading events', () => {
  // Monday 08:00 to 22:00: only 20:00 to 22:00 is reading
  expect(stepReading(READER, at(0, 8), at(0, 22)).bookHours).toBeCloseTo(2, 5);
  expect(stepReading(READER, at(0, 8), at(0, 12)).bookHours).toBe(0);
});

test('a declined occurrence is not read', () => {
  const declined = { ...READER, declined: ['read-evening@0'] };
  expect(stepReading(declined, at(0, 8), at(0, 22)).bookHours).toBe(0);
  expect(stepReading(declined, at(1, 8), at(1, 22)).bookHours).toBe(2);
});

test('only the hours that finish the book count', () => {
  const state = { ...READER, bookHours: FIRST.hours - 0.5 };
  expect(readingHoursBetween(state, at(5, 20), at(5, 23))).toBe(0.5);
});

test('a finished book goes to the read ones', () => {
  const last = { ...READER, bookHours: FIRST.hours - 0.5 };
  expect(stepReading(last, at(5, 20), at(5, 23))).toEqual({
    bookId: undefined,
    bookHours: 0,
    readBookIds: [FIRST.id],
  });
});

test('nothing to read once every book is read', () => {
  const all = {
    ...INITIAL_READING,
    ...READING_SCHEDULE,
    readBookIds: BOOKS.map((book) => book.id),
  };
  expect(isLibraryRead(all)).toBe(true);
  expect(startBook(all, at(0, 19), at(0, 21), 0.5).bookId).toBeUndefined();
});
