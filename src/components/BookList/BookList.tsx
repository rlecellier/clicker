import type { CatalogBook } from '@game/reading';

import styles from './BookList.module.css';

type BookListProps = {
  books: CatalogBook[];
};

export const BookList = ({ books }: BookListProps) => (
  <ul className={styles.root}>
    {books.map((book) => (
      <li key={book.id} className={styles.item}>
        <span className={styles.title}>{book.title}</span>
        <span className={styles.author}>{book.author}</span>
        <span className={styles.details}>
          {book.theme} · {book.pages} pages · complexity {book.complexity}/5
        </span>
      </li>
    ))}
  </ul>
);
