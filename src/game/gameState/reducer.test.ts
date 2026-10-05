import { expect, test } from 'vitest';

import { FRIDGE_MAX } from '@game/fridge';
import { INITIAL_COINS } from '@game/coins';
import { BOOKS } from '@game/reading';
import { gameStateFactory } from '@test/factories/gameStateFactory';

import { gameReducer, type GameAction } from './reducer';
import { plannedOf } from './selectors';
import { INITIAL_GAME_STATE, newGameState, type GameState } from './types';

const perform = (
  actionId: Extract<GameAction, { type: 'perform' }>['actionId'],
) => ({ type: 'perform', actionId, roll: 0 }) as const;

// Lets the whole action in progress go by.
const finish = (state: GameState) =>
  gameReducer(state, { type: 'tick', hours: 100 });

// Does an action from start to end.
const doAction = (state: GameState, actionId: Parameters<typeof perform>[0]) =>
  finish(gameReducer(state, perform(actionId)));

// Monday 07:00, a clothes seller, at home.
const SELLER = gameStateFactory.build({ traits: ['working'] });
const AT_WORK_8 = { ...SELLER, elapsedHours: 8, location: 'work' as const };

test('a new game starts at home, jobless, with a few coins, a full fridge and an empty calendar', () => {
  const state = newGameState({
    origin: Date.UTC(2026, 9, 5),
    startHours: 2 * 24 + 14.5,
    birthDate: '2008-10-07',
  });
  expect(state).toMatchObject({
    location: 'home',
    coins: INITIAL_COINS,
    fridge: FRIDGE_MAX,
    history: [],
    elapsedHours: 2 * 24 + 14.5,
    startHours: 2 * 24 + 14.5,
  });
  expect(state.job).toBeUndefined();
  expect(state.activity).toBeUndefined();
});

test('starting an action does not move the clock: time goes by with the ticks', () => {
  const started = gameReducer(INITIAL_GAME_STATE, perform('sleep-4'));
  expect(started.elapsedHours).toBe(7);
  expect(started.activity).toMatchObject({ id: 'sleep-4', from: 7, done: 0 });

  const halfway = gameReducer(started, { type: 'tick', hours: 2 });
  expect(halfway.elapsedHours).toBe(9);
  expect(halfway.activity?.done).toBe(2);
  expect(halfway.history).toEqual([
    { kind: 'sleep', title: 'Sleep', start: 7, end: 9 },
  ]);

  // the gauges follow the time: 2 hours out of 4 of sleep
  expect(halfway.brain).toBeCloseTo(INITIAL_GAME_STATE.brain - 20, 5);
});

test('the time of an action is never more than its duration', () => {
  const state = finish(gameReducer(INITIAL_GAME_STATE, perform('sleep-2')));
  expect(state.elapsedHours).toBe(9);
  expect(state.activity).toBeUndefined();
  // nothing runs without an action
  expect(gameReducer(state, { type: 'tick', hours: 5 })).toBe(state);
});

test('many small ticks give the same hours as one big one', () => {
  let state = gameReducer(INITIAL_GAME_STATE, perform('meal'));
  for (let frame = 0; frame < 300; frame += 1) {
    state = gameReducer(state, { type: 'tick', hours: 0.01 });
  }
  expect(state.activity).toBeUndefined();
  expect(state.elapsedHours).toBe(8);
  expect(state.history).toEqual([
    { kind: 'meal', title: 'Meal', start: 7, end: 8 },
  ]);
});

test('only one action runs at a time', () => {
  const busy = gameReducer(SELLER, perform('sleep-2'));
  expect(gameReducer(busy, perform('sleep-4')).activity).toBe(busy.activity);
  expect(gameReducer(busy, { type: 'goTo', place: 'work' })).toBe(busy);
  expect(gameReducer(busy, { type: 'takeJob', jobId: 'clothes-seller' })).toBe(
    busy,
  );
});

test('an action moves the clock by its duration and is written down', () => {
  const state = doAction(INITIAL_GAME_STATE, 'meal');
  expect(state.elapsedHours).toBe(INITIAL_GAME_STATE.elapsedHours + 1);
  expect(state.history).toEqual([
    { kind: 'meal', title: 'Meal', start: 7, end: 8 },
  ]);
});

test('sleeping lasts as long as chosen and empties the brain', () => {
  const awake = { ...INITIAL_GAME_STATE, brain: 50 };
  const state = doAction(awake, 'sleep-4');
  expect(state.elapsedHours).toBe(11);
  expect(state.brain).toBeCloseTo(10, 5);
});

test('a meal fills the calories', () => {
  const state = doAction({ ...INITIAL_GAME_STATE, calories: 30 }, 'meal');
  expect(state.calories).toBeGreaterThan(30);
});

test('actions done in a row are merged in the history', () => {
  const slept = doAction(doAction(INITIAL_GAME_STATE, 'sleep-2'), 'sleep-4');
  expect(slept.history).toEqual([
    { kind: 'sleep', title: 'Sleep', start: 7, end: 13 },
  ]);
});

test('an action of another place is queued, not done', () => {
  const queued = gameReducer(AT_WORK_8, perform('meal'));
  expect(queued.activity).toBeUndefined();
  expect(queued.queue).toEqual([{ actionId: 'meal', roll: 0 }]);
  // there is no job to go and work at
  expect(gameReducer(INITIAL_GAME_STATE, perform('work'))).toBe(
    INITIAL_GAME_STATE,
  );
});

test('queued actions start in order once the player is at their place', () => {
  let queued: GameState = AT_WORK_8;
  for (const id of ['snack', 'meal', 'read-1'] as const) {
    queued = gameReducer(queued, perform(id));
  }
  expect(queued.queue).toHaveLength(3);

  const home = gameReducer(queued, { type: 'goTo', place: 'home' });
  expect(home.activity?.id).toBe('snack');
  expect(home.queue.map(({ actionId }) => actionId)).toEqual([
    'meal',
    'read-1',
  ]);

  // each one starts as the previous is over
  const meal = finish(home);
  expect(meal.activity?.id).toBe('meal');
  const reading = finish(meal);
  expect(reading.activity?.id).toBe('read-1');
  expect(finish(reading).queue).toEqual([]);
});

test('actions of the current place are queued while the player is busy', () => {
  let busy = gameReducer(INITIAL_GAME_STATE, perform('think-60'));
  for (let index = 0; index < 3; index++)
    busy = gameReducer(busy, perform('think-60'));
  expect(busy.queue).toHaveLength(3);

  // they chain one after the other, as many as were clicked
  const last = finish(finish(finish(busy)));
  expect(last.queue).toEqual([]);
  expect(last.activity?.id).toBe('think-60');
  expect(finish(last).activity).toBeUndefined();
});

test('a queued action waits at the head of the queue for its place', () => {
  const queued = gameReducer(SELLER, perform('eat-out'));
  const eating = finish(gameReducer(queued, perform('meal')));
  // eat-out is for work: it stays queued at home
  expect(eating.activity).toBeUndefined();
  expect(eating.queue).toHaveLength(1);
  const work = gameReducer(eating, { type: 'goTo', place: 'work' });
  expect(work.activity?.id).toBe('eat-out');
});

test('a queued action that cannot be done any more is dropped', () => {
  const queued = gameReducer(AT_WORK_8, { ...perform('meal') });
  const empty = { ...queued, fridge: 0 };
  const home = gameReducer(empty, { type: 'goTo', place: 'home' });
  expect(home.activity).toBeUndefined();
  expect(home.queue).toEqual([]);
});

test('a queued action can be cancelled', () => {
  const queued = gameReducer(AT_WORK_8, perform('meal'));
  expect(gameReducer(queued, { type: 'unqueue', index: 0 }).queue).toEqual([]);
});

test('thinking is possible anywhere and lets 30 min, 1 or 2 hours go by', () => {
  expect(doAction(INITIAL_GAME_STATE, 'think-30').elapsedHours).toBe(7.5);
  expect(doAction(INITIAL_GAME_STATE, 'think-60').elapsedHours).toBe(8);
  expect(doAction(AT_WORK_8, 'think-120').elapsedHours).toBe(10);
  expect(doAction(AT_WORK_8, 'think-120').location).toBe('work');
  expect(doAction(INITIAL_GAME_STATE, 'think-60').history).toEqual([
    { kind: 'think', title: 'Think', start: 7, end: 8 },
  ]);
});

test('reading draws a book and moves it on', () => {
  const state = doAction(INITIAL_GAME_STATE, 'read-1');
  expect(state.bookId).toBe(BOOKS[0]?.id);
  expect(state.bookHours).toBe(1);
  expect(state.elapsedHours).toBe(8);
  expect(state.activity).toBeUndefined();
  expect(doAction(INITIAL_GAME_STATE, 'read-3').bookHours).toBe(3);
});

test('the book moves on while the player reads', () => {
  const halfway = gameReducer(
    gameReducer(INITIAL_GAME_STATE, perform('read-2')),
    { type: 'tick', hours: 1 },
  );
  expect(halfway.bookId).toBe(BOOKS[0]?.id);
  expect(halfway.bookHours).toBeCloseTo(1, 5);
});

test('the last pages of a book end it, and the hours past them are lost', () => {
  const book = BOOKS[0];
  const almost = {
    ...INITIAL_GAME_STATE,
    bookId: book?.id,
    bookHours: 5,
  };
  const state = doAction(almost, 'read-3');
  expect(state.bookId).toBeUndefined();
  expect(state.readBookIds).toEqual([book?.id]);
  expect(state.elapsedHours).toBe(10);
});

test('reading is not possible once the whole library is read', () => {
  const done = {
    ...INITIAL_GAME_STATE,
    readBookIds: BOOKS.map((book) => book.id),
  };
  expect(gameReducer(done, perform('read-1'))).toBe(done);
});

test('looking for a job takes an hour and hires the player at the end', () => {
  const started = gameReducer(INITIAL_GAME_STATE, {
    type: 'takeJob',
    jobId: 'clothes-seller',
  });
  expect(started.job).toBeUndefined();

  const state = finish(started);
  expect(state.job).toEqual({ id: 'clothes-seller', since: 8 });
  expect(state.elapsedHours).toBe(8);
  expect(state.history).toEqual([
    { kind: 'search', title: 'Job hunt', start: 7, end: 8 },
  ]);
});

test('a player who has a job cannot take another one', () => {
  expect(
    gameReducer(SELLER, { type: 'takeJob', jobId: 'clothes-seller' }),
  ).toBe(SELLER);
});

test('the player cannot look for a job from work', () => {
  const state = { ...INITIAL_GAME_STATE, location: 'work' as const };
  expect(gameReducer(state, { type: 'takeJob', jobId: 'clothes-seller' })).toBe(
    state,
  );
});

test('the player goes to work with a job, and back home', () => {
  const atWork = gameReducer(SELLER, { type: 'goTo', place: 'work' });
  expect(atWork.location).toBe('work');
  // travelling takes no time
  expect(atWork.elapsedHours).toBe(SELLER.elapsedHours);
  expect(gameReducer(atWork, { type: 'goTo', place: 'home' }).location).toBe(
    'home',
  );
});

test('the player cannot go to work without a job', () => {
  expect(gameReducer(INITIAL_GAME_STATE, { type: 'goTo', place: 'work' })).toBe(
    INITIAL_GAME_STATE,
  );
});

test('each click at work is half an hour of work, paid as time goes by', () => {
  const started = gameReducer(AT_WORK_8, perform('work'));
  expect(started.coins).toBe(AT_WORK_8.coins);

  const worked = finish(started);
  expect(worked.elapsedHours).toBe(8.5);
  // 10 coins an hour
  expect(worked.coins).toBe(AT_WORK_8.coins + 5);
  expect(doAction(worked, 'work').coins).toBe(AT_WORK_8.coins + 10);
});

test('work done in a row is a single entry of the calendar', () => {
  const worked = doAction(doAction(AT_WORK_8, 'work'), 'work');
  expect(worked.history).toEqual([
    { kind: 'work', title: 'Work', start: 8, end: 9 },
  ]);
});

test('work is only possible during the working hours', () => {
  const early = { ...AT_WORK_8, elapsedHours: 6 };
  expect(gameReducer(early, perform('work'))).toBe(early);
  const lunchTime = { ...AT_WORK_8, elapsedHours: 12.5 };
  expect(gameReducer(lunchTime, perform('work'))).toBe(lunchTime);
  // Saturday
  const weekend = { ...AT_WORK_8, elapsedHours: 5 * 24 + 9 };
  expect(gameReducer(weekend, perform('work'))).toBe(weekend);
});

test('the player stays at work until they leave, even after the shift', () => {
  const nearlyDone = { ...AT_WORK_8, elapsedHours: 11.5 };
  const state = doAction(nearlyDone, 'work');
  expect(state.elapsedHours).toBe(12);
  expect(state.location).toBe('work');
  expect(state.coins).toBe(nearlyDone.coins + 5);
});

test('a meal at home comes out of the fridge', () => {
  const started = gameReducer(INITIAL_GAME_STATE, perform('meal'));
  expect(started.fridge).toBe(FRIDGE_MAX - 1);
  expect(doAction(INITIAL_GAME_STATE, 'meal').fridge).toBe(FRIDGE_MAX - 1);
});

test('no meal at home with an empty fridge', () => {
  const empty = { ...INITIAL_GAME_STATE, fridge: 0 };
  expect(gameReducer(empty, perform('snack'))).toBe(empty);
});

test('shopping fills the fridge once it is over, and costs an hour', () => {
  const low = { ...INITIAL_GAME_STATE, fridge: 2 };
  const started = gameReducer(low, perform('shopping'));
  expect(started.fridge).toBe(2);

  const state = finish(started);
  expect(state.fridge).toBe(FRIDGE_MAX);
  expect(state.elapsedHours).toBe(8);
  expect(state.history).toEqual([
    { kind: 'shopping', title: 'Shopping', start: 7, end: 8 },
  ]);
});

test('no shopping when the fridge is full', () => {
  expect(gameReducer(INITIAL_GAME_STATE, perform('shopping'))).toBe(
    INITIAL_GAME_STATE,
  );
});

test('eating out at work costs coins and leaves the fridge alone', () => {
  const started = gameReducer(AT_WORK_8, perform('eat-out'));
  expect(started.coins).toBe(AT_WORK_8.coins - 8);
  expect(started.fridge).toBe(AT_WORK_8.fridge);
  expect(finish(started).elapsedHours).toBe(9);
});

test('no eating out without the coins for it', () => {
  const poor = { ...AT_WORK_8, coins: 7 };
  expect(gameReducer(poor, perform('eat-out'))).toBe(poor);
});

test('working burns more calories than reading', () => {
  const rested = { ...AT_WORK_8, calories: 50 };
  const worked = doAction(rested, 'work');
  const read = doAction({ ...rested, location: 'home' }, 'read-1');
  expect(50 - worked.calories).toBeGreaterThan((50 - read.calories) / 2);
});

test('the queue is laid out after the action in progress, up to an action of another place', () => {
  let busy = gameReducer(INITIAL_GAME_STATE, perform('think-60'));
  busy = gameReducer(busy, perform('think-30'));
  busy = gameReducer(busy, perform('think-60'));
  expect(plannedOf(busy)).toEqual([
    { index: 0, kind: 'think', title: 'Think', start: 8, end: 8.5 },
    { index: 1, kind: 'think', title: 'Think', start: 8.5, end: 9.5 },
  ]);

  // an action of another place waits for the player to go there
  const waiting = gameReducer(AT_WORK_8, perform('meal'));
  expect(plannedOf(waiting)).toEqual([]);
});

test('the player can take everything off the queue at once', () => {
  let busy = gameReducer(INITIAL_GAME_STATE, perform('think-60'));
  busy = gameReducer(busy, perform('think-60'));
  const cleared = gameReducer(busy, { type: 'clearQueue' });
  expect(cleared.queue).toEqual([]);
  expect(cleared.activity).toEqual(busy.activity);
});
