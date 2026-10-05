import {
  ACTIONS,
  actionsAt,
  isDoableAt,
  JOB_SEARCH,
  type Action,
} from '@game/actions';
import { FRIDGE_MAX } from '@game/fridge';
import type { Location } from '@game/location';
import { getBook, isLibraryRead } from '@game/reading';
import { nextShiftAfter, shiftAt } from '@game/jobs';
import { HOURS_PER_WEEK } from '@game/time';

import type { Activity, GameState } from './types';

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

type Step = Pick<Action, 'title' | 'kind' | 'hours' | 'calories'>;

// What an activity is made of: the action, or the job hunt.
export const stepOf = ({ id }: Activity): Step =>
  id === 'job-search' ? JOB_SEARCH : ACTIONS[id];

// Why an action cannot be done right now, undefined when it can.
export const blockerOf = (
  state: GameState,
  action: Action,
): string | undefined => {
  if (state.activity) return 'Busy';
  if (!isDoableAt(action, state.location)) return 'Not here';
  if (action.kind === 'work' && !currentShiftOf(state)) {
    return 'Not your working hours';
  }
  if (action.kind === 'read' && isLibraryRead(state)) {
    return 'The whole library is read';
  }
  if ((action.portions ?? 0) > state.fridge) return 'The fridge is empty';
  if (action.restocks && state.fridge >= FRIDGE_MAX) {
    return 'The fridge is full';
  }
  return (action.cost ?? 0) > state.coins ? 'Not enough coins' : undefined;
};

// Why an action cannot be queued, undefined when it can: the rest is checked
// once the player is free and at its place.
export const queueBlockerOf = (
  state: GameState,
  action: Action,
): string | undefined =>
  action.place === 'work' && !state.job ? 'You have no job' : undefined;

// The actions of a place, with what keeps the player from doing one: right
// now where they are (queued when they are busy), and from queueing it
// anywhere else.
export const actionsOfPlace = (state: GameState, place: Location) =>
  actionsAt(place).map((action) => ({
    action,
    blocker:
      place === state.location && !state.activity
        ? blockerOf(state, action)
        : queueBlockerOf(state, action),
  }));

// The queued actions, in order.
export const queuedActionsOf = (state: GameState) =>
  state.queue.map(({ actionId }) => ACTIONS[actionId]);

// The book on the go.
export const currentBookOf = (state: GameState) => getBook(state.bookId);

// The action in progress, with how far it is, if any.
export const currentActivityOf = (state: GameState) =>
  state.activity && {
    title: stepOf(state.activity).title,
    done: state.activity.done,
    hours: stepOf(state.activity).hours,
  };
