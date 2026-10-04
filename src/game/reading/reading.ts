import { eventAt } from '@game/calendar';
import { HOURS_PER_WEEK } from '@game/time';

import { BOOKS, getBook } from './books';
import type { Reading } from './types';

export const INITIAL_READING: Reading = {
  bookId: undefined,
  bookHours: 0,
  readBookIds: [],
  isReading: false,
};

// Books still to read.
export const unreadBooks = (state: Reading) =>
  BOOKS.filter((book) => !state.readBookIds.includes(book.id));

export const isLibraryRead = (state: Reading) =>
  unreadBooks(state).length === 0;

// Starts or pauses the reading. With no book on the go, a new one is drawn
// among the unread ones: `roll` is a number in [0, 1) that picks it, so the
// randomness stays out of the rules.
export const toggleReading = (state: Reading, roll: number): Reading => {
  if (state.isReading) return { ...state, isReading: false };
  if (getBook(state.bookId)) return { ...state, isReading: true };
  const unread = unreadBooks(state);
  const book = unread[Math.floor(roll * unread.length)];
  return book
    ? { ...state, bookId: book.id, bookHours: 0, isReading: true }
    : state;
};

// Free time: nothing is scheduled. Events start and end on half hours.
export const isFreeTime = (weekHour: number) => !eventAt(weekHour);

// Game hours between `from` and `to` that go to the book: the free hours,
// while the player reads and the book is not finished. Reading starts at
// `from` and goes on until the book is done.
export const readingHoursBetween = (
  state: Reading,
  from: number,
  to: number,
) => {
  const book = getBook(state.bookId);
  if (!book || !state.isReading) return 0;
  const left = book.hours - state.bookHours;
  let free = 0;
  for (let time = from; time < to && free < left;) {
    const end = Math.min(to, (Math.floor(time * 2) + 1) / 2);
    if (isFreeTime(((time + end) / 2) % HOURS_PER_WEEK)) free += end - time;
    time = end;
  }
  return Math.min(free, left);
};

// Only the reading fields: the reducer spreads the result into the game state.
const pickReading = ({
  bookId,
  bookHours,
  readBookIds,
  isReading,
}: Reading): Reading => ({ bookId, bookHours, readBookIds, isReading });

// A finished book goes to the read ones and leaves the player free to pick
// another.
export const stepReading = (
  state: Reading,
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
        isReading: false,
      };
};
