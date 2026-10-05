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

// With no book on the go, draws a new book among the unread ones: `roll` is a
// number in [0, 1) that picks it, so the randomness stays out of the rules.
export const drawBook = (state: Reading, roll: number): Reading => {
  if (getBook(state.bookId)) return state;
  const unread = unreadBooks(state);
  const book = unread[Math.floor(roll * unread.length)];
  return book ? { ...state, bookId: book.id, bookHours: 0 } : state;
};

export type ReadingResult = {
  reading: Reading;
  // hours that went to the book, none when the whole library is read
  hours: number;
};

// Reads for some hours: draws a book if there is none on the go, moves it on,
// and puts it with the books read once its last page is turned. The hours past
// the last page of a book are lost: the next book starts with the next
// reading.
export const readBook = (
  state: Reading,
  hours: number,
  roll: number,
): ReadingResult => {
  const drawn = drawBook(state, roll);
  const book = getBook(drawn.bookId);
  if (!book) return { reading: drawn, hours: 0 };

  const read = Math.min(hours, book.hours - drawn.bookHours);
  const bookHours = drawn.bookHours + read;
  return {
    hours: read,
    reading:
      bookHours < book.hours
        ? { ...drawn, bookHours }
        : {
            bookId: undefined,
            bookHours: 0,
            readBookIds: [...drawn.readBookIds, book.id],
          },
  };
};
