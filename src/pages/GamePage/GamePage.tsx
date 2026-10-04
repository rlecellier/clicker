import { Button } from '@base-ui/react/button';
import { Briefcase, Hammer } from 'lucide-react';
import { useOutletContext } from 'react-router';

import { MoneyCounter } from '@component/MoneyCounter';
import { PendingPay } from '@component/PendingPay';
import { TimeControls } from '@component/TimeControls';
import { WeekCalendar } from '@component/WeekCalendar';
import { WorkingDayProgress } from '@component/WorkingDayProgress';
import {
  CLICK_VALUE,
  WORKING_DAY_REWARD,
  type UseGameResult,
} from '@hook/useGame';

import styles from './GamePage.module.css';

export const GamePage = () => {
  const {
    money,
    weekHour,
    speed,
    canSpeedUp,
    canSlowDown,
    faster,
    slower,
    pendingPay,
    isEarning,
    progress,
    isWorkingDay,
    work,
    startWorkingDay,
  } = useOutletContext<UseGameResult>();

  return (
    <>
      <MoneyCounter amount={money} />
      <PendingPay amount={pendingPay} isEarning={isEarning} />
      <WeekCalendar weekHour={weekHour} />
      <TimeControls
        speed={speed}
        canSpeedUp={canSpeedUp}
        canSlowDown={canSlowDown}
        onFaster={faster}
        onSlower={slower}
      />
      <div className={styles.actions}>
        <Button onClick={work} disabled={isWorkingDay}>
          <Hammer aria-hidden size={18} /> Work (+${CLICK_VALUE})
        </Button>
        <Button onClick={startWorkingDay} disabled={isWorkingDay}>
          <Briefcase aria-hidden size={18} /> Working day (5s, +$
          {WORKING_DAY_REWARD})
        </Button>
      </div>
      {isWorkingDay && <WorkingDayProgress progress={progress} />}
    </>
  );
};
