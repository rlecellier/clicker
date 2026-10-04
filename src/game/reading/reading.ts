import { eventAt, type Schedule } from '@game/calendar';

import { BOOKS, getBook } from './books';
import type { Reading } from './types';

export const INITIAL_READING: Reading = {
  bookId: undefined,
  bookHours: 0,
  readBookIds: [],
};

// Books still to read.
export const unreadBooks = (state: Reading) =>
  BOOKS.filter((book) => !state.readBookIds.includes(book.id));

export const isLibraryRead = (state: Reading) =>
  unreadBooks(state).length === 0;

// Whether a reading event runs at a given game hour.
export const isReadingAt = (schedule: Schedule, hour: number) =>
  eventAt(schedule, hour)?.kind === 'read';

// Game hours of reading events between `from` and `to`. Events start and end
// on half hours.
const readingEventHoursBetween = (
  schedule: Schedule,
  from: number,
  to: number,
) => {
  let hours = 0;
  for (let time = from; time < to;) {
    const end = Math.min(to, (Math.floor(time * 2) + 1) / 2);
    if (isReadingAt(schedule, (time + end) / 2)) hours += end - time;
    time = end;
  }
  return hours;
};

// Only the reading fields: the reducer spreads the result into the game state.
const pickReading = ({ bookId, bookHours, readBookIds }: Reading): Reading => ({
  bookId,
  bookHours,
  readBookIds,
});

// With no book on the go and a reading event between `from` and `to`, draws
// a new book among the unread ones: `roll` is a number in [0, 1) that picks
// it, so the randomness stays out of the rules.
export const startBook = (
  state: Reading & Schedule,
  from: number,
  to: number,
  roll: number,
): Reading => {
  if (
    getBook(state.bookId) ||
    readingEventHoursBetween(state, from, to) === 0
  ) {
    return pickReading(state);
  }
  const unread = unreadBooks(state);
  const book = unread[Math.floor(roll * unread.length)];
  return book
    ? { ...pickReading(state), bookId: book.id, bookHours: 0 }
    : pickReading(state);
};

// Game hours between `from` and `to` that go to the book on the go: the hours
// of the reading events, until the book is finished.
export const readingHoursBetween = (
  state: Reading & Schedule,
  from: number,
  to: number,
) => {
  const book = getBook(state.bookId);
  return book
    ? Math.min(
        readingEventHoursBetween(state, from, to),
        book.hours - state.bookHours,
      )
    : 0;
};

// A finished book goes to the read ones; the next reading event draws another.
export const stepReading = (
  state: Reading & Schedule,
  from: number,
  to: number,
): Reading => {
  const book = getBook(state.bookId);
  if (!book) return pickReading(state);
  const bookHours = Math.min(
    state.bookHours + readingHoursBetween(state, from, to),
    book.hours,
  );
  return bookHours < book.hours
    ? { ...pickReading(state), bookHours }
    : {
        bookId: undefined,
        bookHours: 0,
        readBookIds: [...state.readBookIds, book.id],
      };
};
