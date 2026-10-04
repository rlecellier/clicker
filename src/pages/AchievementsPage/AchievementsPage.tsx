import { BookProgress } from '@component/BookProgress';
import { useGameContext } from '@context/GameContext';
import { BOOK_HOURS } from '@game/reading';

import styles from './AchievementsPage.module.css';

export const AchievementsPage = () => {
  const { bookHours, isReadingNow, isBookFinished } = useGameContext();

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Achievements</h2>
      <h3 className={styles.name}>Read a book</h3>
      <BookProgress
        hoursRead={bookHours}
        totalHours={BOOK_HOURS}
        isReading={isReadingNow}
      />
      {isBookFinished && <p className={styles.done}>Book finished!</p>}
    </section>
  );
};
