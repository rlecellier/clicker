export type Reading = {
  // free-time hours spent on the book so far, between 0 and BOOK_HOURS
  bookHours: number;
  // the player wants to read: the book moves on during free time only
  isReading: boolean;
};
