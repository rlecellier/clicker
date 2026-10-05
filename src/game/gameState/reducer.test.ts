import { expect, test } from 'vitest';

import { BOOKS } from '@game/reading';
import { gameStateFactory } from '@test/factories/gameStateFactory';

import { gameReducer, type GameAction } from './reducer';
import { INITIAL_GAME_STATE, newGameState } from './types';

const perform = (
  actionId: Extract<GameAction, { type: 'perform' }>['actionId'],
) => ({ type: 'perform', actionId, roll: 0 }) as const;

// Monday 07:00, a clothes seller, at home.
const SELLER = gameStateFactory.build({ traits: ['working'] });
const AT_WORK_8 = { ...SELLER, elapsedHours: 8, location: 'work' as const };

test('a new game starts at home, jobless, with no coin and an empty calendar', () => {
  const state = newGameState({
    origin: Date.UTC(2026, 9, 5),
    startHours: 2 * 24 + 14.5,
    birthDate: '2008-10-07',
  });
  expect(state).toMatchObject({
    location: 'home',
    coins: 0,
    history: [],
    elapsedHours: 2 * 24 + 14.5,
    startHours: 2 * 24 + 14.5,
  });
  expect(state.job).toBeUndefined();
});

test('time does not move until the player acts', () => {
  const state = gameReducer(INITIAL_GAME_STATE, {
    type: 'goTo',
    place: 'home',
  });
  expect(state.elapsedHours).toBe(INITIAL_GAME_STATE.elapsedHours);
});

test('an action moves the clock by its duration and is written down', () => {
  const state = gameReducer(INITIAL_GAME_STATE, perform('lunch'));
  expect(state.elapsedHours).toBe(INITIAL_GAME_STATE.elapsedHours + 1);
  expect(state.history).toEqual([
    { kind: 'meal', title: 'Lunch', start: 7, end: 8 },
  ]);
});

test('sleeping lasts as long as chosen and empties the brain', () => {
  const awake = { ...INITIAL_GAME_STATE, brain: 50 };
  const state = gameReducer(awake, perform('sleep-4'));
  expect(state.elapsedHours).toBe(11);
  expect(state.brain).toBeCloseTo(10, 5);
});

test('a meal fills the calories', () => {
  const state = gameReducer(
    { ...INITIAL_GAME_STATE, calories: 30 },
    perform('dinner'),
  );
  expect(state.calories).toBeGreaterThan(30);
});

test('actions done in a row are merged in the history', () => {
  const slept = gameReducer(
    gameReducer(INITIAL_GAME_STATE, perform('sleep-2')),
    perform('sleep-4'),
  );
  expect(slept.history).toEqual([
    { kind: 'sleep', title: 'Sleep', start: 7, end: 13 },
  ]);
});

test('an action of another place is not done', () => {
  expect(gameReducer(INITIAL_GAME_STATE, perform('work'))).toBe(
    INITIAL_GAME_STATE,
  );
  expect(gameReducer(AT_WORK_8, perform('lunch'))).toBe(AT_WORK_8);
});

test('reading draws a book and moves it on', () => {
  const state = gameReducer(INITIAL_GAME_STATE, perform('read-1'));
  expect(state.bookId).toBe(BOOKS[0]?.id);
  expect(state.bookHours).toBe(1);
  expect(gameReducer(INITIAL_GAME_STATE, perform('read-3')).bookHours).toBe(3);
});

test('reading is not possible once the whole library is read', () => {
  const done = {
    ...INITIAL_GAME_STATE,
    readBookIds: BOOKS.map((book) => book.id),
  };
  expect(gameReducer(done, perform('read-1'))).toBe(done);
});

test('looking for a job takes an hour and hires the player', () => {
  const state = gameReducer(INITIAL_GAME_STATE, {
    type: 'takeJob',
    jobId: 'clothes-seller',
  });
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

test('each click at work is half an hour of work, paid at once', () => {
  const worked = gameReducer(AT_WORK_8, perform('work'));
  expect(worked.elapsedHours).toBe(8.5);
  // 10 coins an hour
  expect(worked.coins).toBe(AT_WORK_8.coins + 5);
  expect(worked.location).toBe('work');
  expect(gameReducer(worked, perform('work')).coins).toBe(AT_WORK_8.coins + 10);
});

test('work done in a row is a single entry of the calendar', () => {
  const worked = gameReducer(
    gameReducer(AT_WORK_8, perform('work')),
    perform('work'),
  );
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

test('at the end of the shift, the player goes home', () => {
  const nearlyDone = { ...AT_WORK_8, elapsedHours: 11.5 };
  const state = gameReducer(nearlyDone, perform('work'));
  expect(state.elapsedHours).toBe(12);
  expect(state.location).toBe('home');
  expect(state.coins).toBe(nearlyDone.coins + 5);
});

test('working burns more calories than reading', () => {
  const rested = { ...AT_WORK_8, calories: 50 };
  const worked = gameReducer(rested, perform('work'));
  const read = gameReducer({ ...rested, location: 'home' }, perform('read-1'));
  expect(50 - worked.calories).toBeGreaterThan((50 - read.calories) / 2);
});

test('restarting gives a brand new game', () => {
  const game = {
    origin: Date.UTC(2026, 9, 5),
    startHours: 10,
    birthDate: '2008-10-05',
  };
  expect(gameReducer(AT_WORK_8, { type: 'restart', game })).toEqual(
    newGameState(game),
  );
});
