import { useCallback, useMemo, useReducer } from 'react';

import { ageAt, birthDateOf } from '@game/age';
import { getBody } from '@game/body';
import {
  canSlowDown,
  canSpeedUp,
  gameReducer,
  INITIAL_GAME_STATE,
  isEarning,
  isEnjoyingCakeNow,
  isSleepingNow,
  locationOf,
  pendingPayOf,
  speedOf,
  weekHourOf,
  weekOf,
} from '@game/gameState';
import { useAutoSave } from '@hook/useAutoSave';
import { useFrameLoop } from '@hook/useFrameLoop';

import { GameContext } from './GameContext';
import type { GameContextValue, GameProviderProps } from './types';

export const GameProvider = ({
  children,
  initialState = INITIAL_GAME_STATE,
  persist = false,
}: GameProviderProps) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  useAutoSave(state, persist);

  useFrameLoop(
    useCallback((seconds: number) => {
      dispatch({ type: 'elapse', seconds });
    }, []),
  );

  const value = useMemo<GameContextValue>(
    () => ({
      balanceCents: state.balanceCents,
      expenses: state.expenses,
      elapsedHours: state.elapsedHours,
      birthDate: state.birthDate,
      age: ageAt(state.elapsedHours),
      week: weekOf(state),
      weekHour: weekHourOf(state),
      speed: speedOf(state),
      canSpeedUp: canSpeedUp(state),
      canSlowDown: canSlowDown(state),
      pendingPayCents: pendingPayOf(state),
      isEarning: isEarning(state),
      location: locationOf(state),
      calories: state.calories,
      body: getBody(state.fat),
      brain: state.brain,
      dreamGauge: state.dreamGauge,
      dreams: state.dreams,
      isSleeping: isSleepingNow(state),
      isEnjoyingCake: isEnjoyingCakeNow(state),
      faster: () => {
        dispatch({ type: 'speedUp' });
      },
      slower: () => {
        dispatch({ type: 'slowDown' });
      },
      snack: () => {
        dispatch({ type: 'eatSnack' });
      },
      cake: () => {
        dispatch({ type: 'enjoyCake' });
      },
      restart: () => {
        dispatch({ type: 'restart', birthDate: birthDateOf(new Date()) });
      },
    }),
    [state],
  );

  return <GameContext value={value}>{children}</GameContext>;
};
