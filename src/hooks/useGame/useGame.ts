import { useCallback, useMemo, useRef, useState } from 'react';

import { useWeekClock } from '@hook/useWeekClock';
import { bankedPay, isWorking, pendingPay } from './earnings';
import {
  eatSnack,
  INITIAL_NUTRITION,
  isEnjoyingCake,
  startCake,
  stepNutrition,
} from './nutrition';
import { INITIAL_GAME_STATE } from './types';

export const useGame = (initialState = INITIAL_GAME_STATE) => {
  const [nutrition, setNutrition] = useState(INITIAL_NUTRITION);
  // game hour reached by the last frame, read by one-shot actions
  const nowRef = useRef(0);

  const onTick = useCallback((from: number, to: number) => {
    nowRef.current = to;
    setNutrition((current) => stepNutrition(current, from, to));
  }, []);

  const {
    elapsedHours,
    week,
    weekHour,
    speed,
    canSpeedUp,
    canSlowDown,
    faster,
    slower,
  } = useWeekClock({ onTick });
  const salary = useMemo(() => bankedPay(week), [week]);

  const snack = useCallback(() => {
    setNutrition(eatSnack);
  }, []);

  const cake = useCallback(() => {
    setNutrition((current) =>
      isEnjoyingCake(current, nowRef.current)
        ? current
        : startCake(current, nowRef.current),
    );
  }, []);

  return {
    // the money given at the start, plus the salary of every finished week
    money: initialState.money + salary,
    week,
    weekHour,
    speed,
    canSpeedUp,
    canSlowDown,
    faster,
    slower,
    pendingPay: pendingPay(week, weekHour),
    isEarning: isWorking(weekHour),
    calories: nutrition.calories,
    fat: nutrition.fat,
    isEnjoyingCake: isEnjoyingCake(nutrition, elapsedHours),
    snack,
    cake,
  };
};

export type UseGameResult = ReturnType<typeof useGame>;
