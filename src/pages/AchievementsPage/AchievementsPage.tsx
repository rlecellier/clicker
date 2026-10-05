import { BookList } from '@component/BookList';
import { BookProgress } from '@component/BookProgress';
import { useGameContext } from '@context/GameContext';

import styles from './AchievementsPage.module.css';

export const AchievementsPage = () => {
  const { currentBook, bookHours, readBooks, isLibraryRead } = useGameContext();

  return (
    <section>
      <h2 className={styles.title}>Achievements</h2>
      <h3 className={styles.name}>Current book</h3>
      {currentBook ? (
        <>
          <p className={styles.author}>
            {currentBook.author} · {currentBook.theme} · {currentBook.pages}{' '}
            pages · complexity {currentBook.complexity}/5
          </p>
          <BookProgress
            title={currentBook.title}
            hoursRead={bookHours}
            totalHours={currentBook.hours}
          />
        </>
      ) : (
        <p className={styles.empty}>No book on the go.</p>
      )}
      <h3 className={styles.name}>Books read ({readBooks.length})</h3>
      {readBooks.length > 0 ? (
        <BookList books={readBooks} />
      ) : (
        <p className={styles.empty}>No book read yet.</p>
      )}
      {isLibraryRead && <p className={styles.done}>Whole library read!</p>}
    </section>
  );
};
