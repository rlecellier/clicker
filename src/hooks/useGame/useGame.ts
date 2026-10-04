import { useCallback, useEffect, useState } from 'react';

import {
  CLICK_VALUE,
  WORKING_DAY_DURATION_MS,
  WORKING_DAY_REWARD,
} from './constants';
import { useWeekClock } from '@hook/useWeekClock';
import { INITIAL_GAME_STATE } from './types';

export function useGame(initialState = INITIAL_GAME_STATE) {
  const [money, setMoney] = useState(initialState.money);
  const [workingDayStart, setWorkingDayStart] = useState<number | undefined>();
  const [progress, setProgress] = useState(0);

  const weekHour = useWeekClock();

  const isWorkingDay = workingDayStart !== undefined;

  const work = useCallback(() => {
    if (!isWorkingDay) setMoney((current) => current + CLICK_VALUE);
  }, [isWorkingDay]);

  const startWorkingDay = useCallback(() => {
    if (!isWorkingDay) setWorkingDayStart(performance.now());
  }, [isWorkingDay]);

  useEffect(() => {
    if (workingDayStart === undefined) return;

    let frame = 0;
    const tick = (now: number) => {
      const ratio = Math.min(
        (now - workingDayStart) / WORKING_DAY_DURATION_MS,
        1,
      );
      setProgress(ratio);
      if (ratio < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setMoney((current) => current + WORKING_DAY_REWARD);
      setWorkingDayStart(undefined);
      setProgress(0);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [workingDayStart]);

  return { money, weekHour, progress, isWorkingDay, work, startWorkingDay };
}

export type UseGameResult = ReturnType<typeof useGame>;
