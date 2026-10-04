import { Button } from '@base-ui/react/button';
import { BookOpen, Cake, Cookie } from 'lucide-react';

import { BookProgress } from '@component/BookProgress';
import { LocationIndicator } from '@component/LocationIndicator';
import { MoneyCounter } from '@component/MoneyCounter';
import { PendingPay } from '@component/PendingPay';
import { ScheduleBanners } from '@component/ScheduleBanners';
import { useGameContext } from '@context/GameContext';
import { SNACK_CALORIES } from '@game/nutrition';
import { BOOK_HOURS } from '@game/reading';

import styles from './GamePage.module.css';

export const GamePage = () => {
  const {
    balanceCents,
    pendingPayCents,
    isEarning,
    location,
    isEnjoyingCake,
    snack,
    cake,
    bookHours,
    isBookFinished,
    isReading,
    isReadingNow,
    toggleReading,
  } = useGameContext();

  return (
    <>
      <ScheduleBanners />
      <div className={styles.content}>
        <LocationIndicator location={location} />
        <PendingPay cents={pendingPayCents} isEarning={isEarning} />
        <div className={styles.cash}>
          <MoneyCounter cents={balanceCents} />
        </div>
        <div className={styles.actions}>
          <Button onClick={snack}>
            <Cookie aria-hidden size={18} /> Eat a snack (+{SNACK_CALORIES}%)
          </Button>
          <Button onClick={cake} disabled={isEnjoyingCake}>
            <Cake aria-hidden size={18} />{' '}
            {isEnjoyingCake ? 'Enjoying a cake…' : 'Enjoy a cake (30 min)'}
          </Button>
          <Button onClick={toggleReading} disabled={isBookFinished}>
            <BookOpen aria-hidden size={18} />{' '}
            {isBookFinished
              ? 'Book read'
              : isReading
                ? 'Stop reading'
                : `Read a book (${BOOK_HOURS} h)`}
          </Button>
          <BookProgress
            hoursRead={bookHours}
            totalHours={BOOK_HOURS}
            isReading={isReadingNow}
          />
        </div>
      </div>
    </>
  );
};
