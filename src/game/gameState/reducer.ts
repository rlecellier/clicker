import { ACTIONS, JOB_SEARCH, type ActionId } from '@game/actions';
import { recordDone, type EventKind } from '@game/history';
import { hireAt, JOBS, shiftAt, type JobId } from '@game/jobs';
import type { Location } from '@game/location';
import { stepNutrition } from '@game/nutrition';
import { readBook } from '@game/reading';
import { stepSleep } from '@game/sleep';

import { blockerOf } from './selectors';
import { newGameState, type GameState, type NewGame } from './types';

export type GameAction =
  // the player does an action of the place they are at. `roll` in [0, 1)
  // draws the book when a reading starts without one
  | { type: 'perform'; actionId: ActionId; roll: number }
  // the player goes to a place: work, if they have a job, or back home
  | { type: 'goTo'; place: Location }
  // the player looks for a job and takes the one they pick
  | { type: 'takeJob'; jobId: JobId }
  // a brand new game, whatever the current one
  | { type: 'restart'; game: NewGame };

type Step = {
  kind: EventKind;
  title: string;
  hours: number;
  calories?: number;
  // hours that go to the book
  readingHours?: number;
  coins?: number;
};

// Lets the hours of a step go by, and writes them in the history. At the end
// of a shift, the player goes home.
const run = (state: GameState, step: Step): GameState => {
  const from = state.elapsedHours;
  const to = from + step.hours;
  const next: GameState = {
    ...state,
    ...stepNutrition(state, step),
    ...stepSleep(state, step, step.readingHours),
    elapsedHours: to,
    coins: state.coins + (step.coins ?? 0),
    history: recordDone(state.history, {
      kind: step.kind,
      title: step.title,
      start: from,
      end: to,
    }),
  };
  return state.location === 'work' && !shiftAt(state.job, to)
    ? { ...next, location: 'home' }
    : next;
};

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'perform': {
      const done = ACTIONS[action.actionId];
      if (blockerOf(state, done)) return state;
      if (done.kind === 'read') {
        const { reading, hours } = readBook(state, done.hours, action.roll);
        return run({ ...state, ...reading }, { ...done, readingHours: hours });
      }
      const hourlyCoins = state.job ? JOBS[state.job.id].hourlyCoins : 0;
      return run(state, {
        ...done,
        coins: done.kind === 'work' ? hourlyCoins * done.hours : 0,
      });
    }
    case 'goTo': {
      if (action.place === state.location) return state;
      // only the job takes the player to work
      return action.place === 'work' && !state.job
        ? state
        : { ...state, location: action.place };
    }
    case 'takeJob': {
      if (state.job || state.location !== 'home') return state;
      const searched = run(state, JOB_SEARCH);
      return { ...searched, job: hireAt(action.jobId, searched.elapsedHours) };
    }
    case 'restart': {
      return newGameState(action.game);
    }
  }
};
