import { Button } from '@base-ui/react/button';
import { Cake, Cookie } from 'lucide-react';

import { BookProgress } from '@component/BookProgress';
import { GetJob } from '@component/GetJob';
import { LocationIndicator } from '@component/LocationIndicator';
import { MoneyCounter } from '@component/MoneyCounter';
import { PendingPay } from '@component/PendingPay';
import { ScheduleBanners } from '@component/ScheduleBanners';
import { useGameContext } from '@context/GameContext';
import { SNACK_CALORIES } from '@game/nutrition';

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
    currentBook,
    bookHours,
    isReadingNow,
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
          <GetJob />
          <Button onClick={snack}>
            <Cookie aria-hidden size={18} /> Eat a snack (+{SNACK_CALORIES}%)
          </Button>
          <Button onClick={cake} disabled={isEnjoyingCake}>
            <Cake aria-hidden size={18} />{' '}
            {isEnjoyingCake ? 'Enjoying a cake…' : 'Enjoy a cake (30 min)'}
          </Button>
          {currentBook && (
            <BookProgress
              title={currentBook.title}
              hoursRead={bookHours}
              totalHours={currentBook.hours}
              isReading={isReadingNow}
            />
          )}
        </div>
      </div>
    </>
  );
};
