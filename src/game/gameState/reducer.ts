import { ACTIONS, type ActionId } from '@game/actions';
import { recordDone } from '@game/history';
import { hireAt, JOBS, type JobId } from '@game/jobs';
import type { Location } from '@game/location';
import { FRIDGE_MAX } from '@game/fridge';
import { stepNutrition } from '@game/nutrition';
import { drawBook, readBook, type Reading } from '@game/reading';
import { stepSleep } from '@game/sleep';

import { blockerOf, queueBlockerOf, stepOf } from './selectors';
import {
  newGameState,
  type Activity,
  type GameState,
  type NewGame,
} from './types';

export type GameAction =
  // the player starts an action of the place they are at. `roll` in [0, 1)
  // draws the book when a reading starts without one
  | { type: 'perform'; actionId: ActionId; roll: number }
  // the player takes an action off the queue
  | { type: 'unqueue'; index: number }
  // real time goes by: the game hours of the action in progress go by with it
  | { type: 'tick'; hours: number }
  // the player goes to a place: work, if they have a job, or back home
  | { type: 'goTo'; place: Location }
  // the player starts looking for a job and takes the one they pick
  | { type: 'takeJob'; jobId: JobId }
  // a brand new game, whatever the current one
  | { type: 'restart'; game: NewGame };

// Starts an activity at the current time of the game.
const startActivity = (
  state: GameState,
  activity: Omit<Activity, 'from' | 'done'>,
): GameState => ({
  ...state,
  activity: { ...activity, from: state.elapsedHours, done: 0 },
});

// The book as a reading goes: moving on while it lasts, and finished or not
// once it is over.
const bookOf = (
  state: GameState,
  reading: NonNullable<Activity['reading']>,
  progress: number,
): Partial<Reading> => {
  if (progress < 1) {
    return { bookHours: reading.bookFrom + reading.hours * progress };
  }
  const { bookId, bookHours, readBookIds } = readBook(
    { ...state, bookHours: reading.bookFrom },
    reading.hours,
    0,
  ).reading;
  return { bookId, bookHours, readBookIds };
};

// Lets some hours of the activity in progress go by, and writes them in the
// history. Gauges, coins and the book follow the time; what the activity ends
// with (the job, the fridge) comes once it is over.
const elapse = (state: GameState, hours: number): GameState => {
  const { activity } = state;
  if (!activity || hours <= 0) return state;

  const step = stepOf(activity);
  const done = Math.min(activity.done + hours, step.hours);
  const chunk = done - activity.done;
  const isOver = done >= step.hours;
  const to = activity.from + done;
  const share = chunk / step.hours;

  const { reading } = activity;
  const readHours = reading ? reading.hours * share : 0;
  const hourlyCoins =
    step.kind === 'work' && state.job ? JOBS[state.job.id].hourlyCoins : 0;

  const next: GameState = {
    ...state,
    ...(reading && bookOf(state, reading, done / step.hours)),
    ...stepNutrition(state, {
      kind: step.kind,
      hours: chunk,
      calories: (step.calories ?? 0) * share,
    }),
    ...stepSleep(state, { kind: step.kind, hours: chunk }, readHours),
    elapsedHours: to,
    coins:
      state.coins +
      Math.floor(hourlyCoins * done) -
      Math.floor(hourlyCoins * activity.done),
    history: recordDone(state.history, {
      kind: step.kind,
      title: step.title,
      start: state.elapsedHours,
      end: to,
    }),
    activity: isOver ? undefined : { ...activity, done },
  };

  if (!isOver) return next;

  const { jobId, id } = activity;
  return startQueued({
    ...next,
    job: jobId ? hireAt(jobId, to) : next.job,
    fridge:
      id !== 'job-search' && ACTIONS[id].restocks ? FRIDGE_MAX : next.fridge,
  });
};

// Starts an action of the place the player is at, the state as it was when it
// cannot be done.
const begin = (state: GameState, actionId: ActionId, roll: number) => {
  const done = ACTIONS[actionId];
  if (blockerOf(state, done)) return state;
  const paid: GameState = {
    ...state,
    coins: state.coins - (done.cost ?? 0),
    fridge: state.fridge - (done.portions ?? 0),
  };
  if (done.kind !== 'read') return startActivity(paid, { id: done.id });

  // the book is drawn as the reading starts, and the hours that go to it
  // are known: the ones past its last page are lost
  const drawn = { ...paid, ...drawBook(paid, roll) };
  const { hours } = readBook(drawn, done.hours, roll);
  return startActivity(drawn, {
    id: done.id,
    reading: { hours, bookFrom: drawn.bookHours },
  });
};

// Starts the queued actions one after the other, as soon as the player is free
// and at their place. One that cannot be done any more is dropped.
const startQueued = (state: GameState): GameState => {
  let current = state;
  while (!current.activity) {
    const [head, ...queue] = current.queue;
    if (!head) break;
    const { place } = ACTIONS[head.actionId];
    if (place !== 'anywhere' && place !== current.location) break;
    current = begin({ ...current, queue }, head.actionId, head.roll);
  }
  return current;
};

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'perform': {
      const done = ACTIONS[action.actionId];
      if (done.place === 'anywhere' || done.place === state.location) {
        return begin(state, action.actionId, action.roll);
      }
      // another place: it waits for the player to be there
      return queueBlockerOf(state, done)
        ? state
        : {
            ...state,
            queue: [
              ...state.queue,
              { actionId: action.actionId, roll: action.roll },
            ],
          };
    }
    case 'unqueue': {
      return {
        ...state,
        queue: state.queue.filter((_, index) => index !== action.index),
      };
    }
    case 'tick': {
      return elapse(state, action.hours);
    }
    case 'goTo': {
      if (state.activity || action.place === state.location) return state;
      // only the job takes the player to work
      return action.place === 'work' && !state.job
        ? state
        : startQueued({ ...state, location: action.place });
    }
    case 'takeJob': {
      return state.job || state.location !== 'home' || state.activity
        ? state
        : startActivity(state, { id: 'job-search', jobId: action.jobId });
    }
    case 'restart': {
      return newGameState(action.game);
    }
  }
};
