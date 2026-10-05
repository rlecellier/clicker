import { actionsAt, type Action } from '@game/actions';
import { getBook, isLibraryRead } from '@game/reading';
import { nextShiftAfter, shiftAt } from '@game/jobs';
import { HOURS_PER_WEEK } from '@game/time';

import type { GameState } from './types';

export const weekOf = (state: GameState) =>
  Math.floor(state.elapsedHours / HOURS_PER_WEEK);

export const weekHourOf = (state: GameState) =>
  state.elapsedHours % HOURS_PER_WEEK;

// Hours the player has lived in the game since it started.
export const playedHoursOf = (state: GameState) =>
  state.elapsedHours - state.startHours;

// The shift the player is in the middle of, if any.
export const currentShiftOf = (state: GameState) =>
  shiftAt(state.job, state.elapsedHours);

export const nextShiftOf = (state: GameState) =>
  nextShiftAfter(state.job, state.elapsedHours);

// Why an action cannot be done right now, undefined when it can.
export const blockerOf = (
  state: GameState,
  action: Action,
): string | undefined => {
  if (action.place !== state.location) return 'Not here';
  if (action.kind === 'work' && !currentShiftOf(state)) {
    return 'Not your working hours';
  }
  return action.kind === 'read' && isLibraryRead(state)
    ? 'The whole library is read'
    : undefined;
};

// The actions of the place the player is at, with what keeps them from doing
// one.
export const availableActionsOf = (state: GameState) =>
  actionsAt(state.location).map((action) => ({
    action,
    blocker: blockerOf(state, action),
  }));

// The book on the go.
export const currentBookOf = (state: GameState) => getBook(state.bookId);
