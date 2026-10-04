import { eventAt } from '@game/calendar';
import { HOURS_PER_WEEK } from '@game/time';

import { BOOK_HOURS } from './constants';
import type { Reading } from './types';

export const INITIAL_READING: Reading = { bookHours: 0, isReading: false };

export const isBookFinished = (state: Reading) => state.bookHours >= BOOK_HOURS;

export const toggleReading = (state: Reading): Reading =>
  isBookFinished(state) ? state : { ...state, isReading: !state.isReading };

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
  if (!state.isReading) return 0;
  const left = BOOK_HOURS - state.bookHours;
  let free = 0;
  for (let time = from; time < to && free < left;) {
    const end = Math.min(to, (Math.floor(time * 2) + 1) / 2);
    if (isFreeTime(((time + end) / 2) % HOURS_PER_WEEK)) free += end - time;
    time = end;
  }
  return Math.min(free, left);
};

export const stepReading = (
  state: Reading,
  from: number,
  to: number,
): Reading => {
  const bookHours = Math.min(
    state.bookHours + readingHoursBetween(state, from, to),
    BOOK_HOURS,
  );
  return {
    bookHours,
    isReading: state.isReading && bookHours < BOOK_HOURS,
  };
};
