import { useCallback, useMemo, useReducer } from 'react';

import { ageAt, birthDateOf } from '@game/age';
import { getBody } from '@game/body';
import {
  availableActionsOf,
  currentActivityOf,
  currentBookOf,
  currentShiftOf,
  gameReducer,
  INITIAL_GAME_STATE,
  nextShiftOf,
  playedHoursOf,
  weekHourOf,
  weekOf,
} from '@game/gameState';
import { gameStartOf } from '@game/time';
import { getBook, isLibraryRead } from '@game/reading';
import { useActionClock } from '@hook/useActionClock';
import { useAutoSave } from '@hook/useAutoSave';

import { GameContext } from './GameContext';
import type { GameContextValue, GameProviderProps } from './types';

export const GameProvider = ({
  children,
  initialState = INITIAL_GAME_STATE,
  persist = false,
}: GameProviderProps) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const tick = useCallback((hours: number) => {
    dispatch({ type: 'tick', hours });
  }, []);
  useActionClock(state.activity !== undefined, tick);
  useAutoSave(state, persist);

  const value = useMemo<GameContextValue>(
    () => ({
      coins: state.coins,
      elapsedHours: state.elapsedHours,
      origin: state.origin,
      birthDate: state.birthDate,
      playedHours: playedHoursOf(state),
      age: ageAt(playedHoursOf(state)),
      week: weekOf(state),
      weekHour: weekHourOf(state),
      location: state.location,
      calories: state.calories,
      fridge: state.fridge,
      body: getBody(state.fat),
      brain: state.brain,
      dreamGauge: state.dreamGauge,
      dreams: state.dreams,
      bookHours: state.bookHours,
      currentBook: currentBookOf(state),
      readBooks: state.readBookIds.flatMap((id) => getBook(id) ?? []),
      isLibraryRead: isLibraryRead(state),
      history: state.history,
      job: state.job,
      activity: currentActivityOf(state),
      currentShift: currentShiftOf(state),
      nextShift: nextShiftOf(state),
      actions: availableActionsOf(state),
      perform: (actionId) => {
        dispatch({ type: 'perform', actionId, roll: Math.random() });
      },
      goTo: (place) => {
        dispatch({ type: 'goTo', place });
      },
      takeJob: (jobId) => {
        dispatch({ type: 'takeJob', jobId });
      },
      restart: () => {
        const now = new Date();
        dispatch({
          type: 'restart',
          game: { ...gameStartOf(now), birthDate: birthDateOf(now) },
        });
      },
    }),
    [state],
  );

  return <GameContext value={value}>{children}</GameContext>;
};
