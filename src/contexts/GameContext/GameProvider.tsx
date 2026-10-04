import { useCallback, useMemo, useReducer } from 'react';

import { ageAt, birthDateOf } from '@game/age';
import { getBody } from '@game/body';
import {
  askingOf,
  canSlowDown,
  canSpeedUp,
  gameReducer,
  INITIAL_GAME_STATE,
  isEarning,
  isEnjoyingCakeNow,
  isReadingNow,
  isSleepingNow,
  locationOf,
  pendingPayOf,
  speedOf,
  weekHourOf,
  weekOf,
} from '@game/gameState';
import { JOBS } from '@game/jobs';
import { getBook, isLibraryRead } from '@game/reading';
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
      dispatch({ type: 'elapse', seconds, roll: Math.random() });
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
      bookHours: state.bookHours,
      currentBook: getBook(state.bookId),
      readBooks: state.readBookIds.flatMap((id) => getBook(id) ?? []),
      isLibraryRead: isLibraryRead(state),
      isReadingNow: isReadingNow(state),
      schedule: { plan: state.plan, declined: state.declined },
      job: state.job,
      obligations: state.job ? JOBS[state.job.id].obligations : [],
      asking: askingOf(state),
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
      takeJob: (jobId) => {
        dispatch({ type: 'takeJob', jobId });
      },
      planEvent: (event) => {
        dispatch({ type: 'planEvent', event });
      },
      answerAsk: (isAccepted) => {
        dispatch({ type: 'answerAsk', isAccepted });
      },
      restart: () => {
        dispatch({ type: 'restart', birthDate: birthDateOf(new Date()) });
      },
    }),
    [state],
  );

  return <GameContext value={value}>{children}</GameContext>;
};
