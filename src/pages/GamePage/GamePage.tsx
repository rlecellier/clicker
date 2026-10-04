import { Button } from '@base-ui/react/button';
import { Cake, Cookie } from 'lucide-react';

import { PendingPay } from '@component/PendingPay';
import { WeekCalendar } from '@component/WeekCalendar';
import { useGameContext } from '@context/GameContext';
import { SNACK_CALORIES } from '@game/nutrition';

import styles from './GamePage.module.css';

export const GamePage = () => {
  const {
    week,
    weekHour,
    pendingPayCents,
    isEarning,
    isEnjoyingCake,
    snack,
    cake,
  } = useGameContext();

  return (
    <>
      <div className={styles.calendar}>
        <WeekCalendar week={week} weekHour={weekHour} />
      </div>
      <div className={styles.content}>
        <PendingPay cents={pendingPayCents} isEarning={isEarning} />
        <div className={styles.actions}>
          <Button onClick={snack}>
            <Cookie aria-hidden size={18} /> Eat a snack (+{SNACK_CALORIES}%)
          </Button>
          <Button onClick={cake} disabled={isEnjoyingCake}>
            <Cake aria-hidden size={18} />{' '}
            {isEnjoyingCake ? 'Enjoying a cake…' : 'Enjoy a cake (30 min)'}
          </Button>
        </div>
      </div>
    </>
  );
};
