export type Book = {
  id: string;
  title: string;
  author: string;
  theme: string;
  pages: number;
};

// A book with what its length makes of it.
export type CatalogBook = Book & {
  // from 1 (light) to 5 (heavy): the longer the book, the harder it is
  complexity: number;
  // free-time hours needed to read it
  hours: number;
};

export type Reading = {
  // book being read, none between two books
  bookId: string | undefined;
  // hours of reading events spent on that book so far, between 0 and its hours
  bookHours: number;
  // ids of the books read to the last page, in reading order
  readBookIds: string[];
};
