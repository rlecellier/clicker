import { useCallback, useMemo, useReducer } from 'react';

import {
  canSlowDown,
  canSpeedUp,
  gameReducer,
  INITIAL_GAME_STATE,
  isEarning,
  isEnjoyingCakeNow,
  pendingPayOf,
  speedOf,
  weekHourOf,
  weekOf,
} from '@game/gameState';
import { useFrameLoop } from '@hook/useFrameLoop';

import { GameContext } from './GameContext';
import type { GameContextValue, GameProviderProps } from './types';

export const GameProvider = ({
  children,
  initialState = INITIAL_GAME_STATE,
}: GameProviderProps) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useFrameLoop(
    useCallback((seconds: number) => {
      dispatch({ type: 'elapse', seconds });
    }, []),
  );

  const value = useMemo<GameContextValue>(
    () => ({
      balanceCents: state.balanceCents,
      week: weekOf(state),
      weekHour: weekHourOf(state),
      speed: speedOf(state),
      canSpeedUp: canSpeedUp(state),
      canSlowDown: canSlowDown(state),
      pendingPayCents: pendingPayOf(state),
      isEarning: isEarning(state),
      calories: state.calories,
      fat: state.fat,
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
    }),
    [state],
  );

  return <GameContext value={value}>{children}</GameContext>;
};
