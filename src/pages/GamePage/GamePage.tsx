import { Button } from '@base-ui/react/button';
import { Cake, Cookie } from 'lucide-react';

import { CaloriesGauge } from '@component/CaloriesGauge';
import { MoneyCounter } from '@component/MoneyCounter';
import { PendingPay } from '@component/PendingPay';
import { TimeControls } from '@component/TimeControls';
import { WeekCalendar } from '@component/WeekCalendar';
import { useGameContext } from '@context/GameContext';
import { SNACK_CALORIES } from '@game/nutrition';

import styles from './GamePage.module.css';

export const GamePage = () => {
  const {
    balanceCents,
    week,
    weekHour,
    speed,
    canSpeedUp,
    canSlowDown,
    faster,
    slower,
    pendingPayCents,
    isEarning,
    calories,
    fat,
    isEnjoyingCake,
    snack,
    cake,
  } = useGameContext();

  return (
    <>
      <MoneyCounter cents={balanceCents} />
      <PendingPay cents={pendingPayCents} isEarning={isEarning} />
      <WeekCalendar week={week} weekHour={weekHour} />
      <TimeControls
        speed={speed}
        canSpeedUp={canSpeedUp}
        canSlowDown={canSlowDown}
        onFaster={faster}
        onSlower={slower}
      />
      <CaloriesGauge calories={calories} fat={fat} />
      <div className={styles.actions}>
        <Button onClick={snack}>
          <Cookie aria-hidden size={18} /> Eat a snack (+{SNACK_CALORIES}%)
        </Button>
        <Button onClick={cake} disabled={isEnjoyingCake}>
          <Cake aria-hidden size={18} />{' '}
          {isEnjoyingCake ? 'Enjoying a cake…' : 'Enjoy a cake (30 min)'}
        </Button>
      </div>
    </>
  );
};
