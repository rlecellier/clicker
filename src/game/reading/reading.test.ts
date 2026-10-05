import { expect, test } from 'vitest';

import { BOOKS, complexityOf, getBook, hoursToRead } from './books';
import { INITIAL_READING, isLibraryRead, readBook } from './reading';

const bookOf = (id: string) => {
  const book = getBook(id);
  if (!book) throw new Error(`unknown book ${id}`);
  return book;
};
const FIRST = bookOf('animal-farm');
const SECOND = bookOf('little-prince');
// The first book on the go.
const READER = { ...INITIAL_READING, bookId: FIRST.id };

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

test('reading draws a book among the unread ones', () => {
  expect(readBook(INITIAL_READING, 1, 0).reading.bookId).toBe(FIRST.id);
  expect(readBook(INITIAL_READING, 1, 0.999).reading.bookId).toBe(
    BOOKS.at(-1)?.id,
  );
  const next = { ...INITIAL_READING, readBookIds: [FIRST.id] };
  expect(readBook(next, 1, 0).reading.bookId).toBe(SECOND.id);
});

test('the book on the go is not replaced by a new draw', () => {
  expect(readBook(READER, 1, 0.999).reading.bookId).toBe(FIRST.id);
});

test('reading moves the book on', () => {
  expect(readBook(READER, 1, 0)).toEqual({
    hours: 1,
    reading: { ...READER, bookHours: 1 },
  });
  expect(readBook({ ...READER, bookHours: 1 }, 2, 0).reading.bookHours).toBe(3);
});

test('only the hours that finish the book count', () => {
  const state = { ...READER, bookHours: FIRST.hours - 0.5 };
  expect(readBook(state, 1, 0).hours).toBe(0.5);
});

test('a finished book goes to the read ones', () => {
  const last = { ...READER, bookHours: FIRST.hours - 0.5 };
  expect(readBook(last, 1, 0).reading).toEqual({
    bookId: undefined,
    bookHours: 0,
    readBookIds: [FIRST.id],
  });
});

test('nothing to read once every book is read', () => {
  const all = {
    ...INITIAL_READING,
    readBookIds: BOOKS.map((book) => book.id),
  };
  expect(isLibraryRead(all)).toBe(true);
  expect(readBook(all, 1, 0.5)).toEqual({ hours: 0, reading: all });
});
