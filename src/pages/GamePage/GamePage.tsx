import { Button } from '@base-ui/react/button';
import { Cake, Cookie } from 'lucide-react';
import { useOutletContext } from 'react-router';

import { CaloriesGauge } from '@component/CaloriesGauge';
import { MoneyCounter } from '@component/MoneyCounter';
import { PendingPay } from '@component/PendingPay';
import { TimeControls } from '@component/TimeControls';
import { WeekCalendar } from '@component/WeekCalendar';
import { SNACK_CALORIES, type UseGameResult } from '@hook/useGame';

import styles from './GamePage.module.css';

export const GamePage = () => {
  const {
    money,
    week,
    weekHour,
    speed,
    canSpeedUp,
    canSlowDown,
    faster,
    slower,
    pendingPay,
    isEarning,
    calories,
    fat,
    isEnjoyingCake,
    snack,
    cake,
  } = useOutletContext<UseGameResult>();

  return (
    <>
      <MoneyCounter amount={money} />
      <PendingPay amount={pendingPay} isEarning={isEarning} />
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
