import { expect, test } from 'vitest';

import { INITIAL_CALORIES, SNACK_CALORIES } from '@game/nutrition';
import {
  DEFAULT_SPEED,
  HOURS_PER_SECOND,
  HOURS_PER_WEEK,
  SPEEDS,
} from '@game/time';

import { gameReducer } from './reducer';
import { INITIAL_GAME_STATE, type GameState } from './types';

// Real seconds needed for the game to run the given number of hours.
const hoursToSeconds = (hours: number) =>
  hours / (HOURS_PER_SECOND * DEFAULT_SPEED);

const run = (state: GameState, hours: number) =>
  gameReducer(state, { type: 'elapse', seconds: hoursToSeconds(hours) });

test('starts on Monday midnight, at the default speed, with fifty percent', () => {
  expect(INITIAL_GAME_STATE).toMatchObject({
    elapsedHours: 0,
    balanceCents: 0,
    calories: INITIAL_CALORIES,
  });
  expect(SPEEDS[INITIAL_GAME_STATE.speedIndex]).toBe(DEFAULT_SPEED);
});

test('is plain JSON, so it can be saved as it is', () => {
  const state = run(INITIAL_GAME_STATE, 30);
  expect(structuredClone(state)).toEqual(state);
});

test('runs the game hours that match the real seconds and the speed', () => {
  const state = run(INITIAL_GAME_STATE, 5);
  expect(state.elapsedHours).toBeCloseTo(5, 5);
});

test('does not change the state it is given', () => {
  const state = { ...INITIAL_GAME_STATE };
  run(state, 12);
  expect(state).toEqual(INITIAL_GAME_STATE);
});

test('pays the weekly salary once the week is over, not before', () => {
  const midWeek = run(INITIAL_GAME_STATE, HOURS_PER_WEEK - 1);
  expect(midWeek.balanceCents).toBe(0);

  const nextWeek = run(midWeek, 2);
  expect(nextWeek.balanceCents).toBe(25_000);
});

test('pays every week that went by in a long frame', () => {
  // Weeks 0 to 3 are in February, a 28-day month.
  const state = run(INITIAL_GAME_STATE, 4 * HOURS_PER_WEEK + 1);
  expect(state.balanceCents).toBe(4 * 25_000);
});

test('a long frame gives the same result as many short ones', () => {
  const long = run(INITIAL_GAME_STATE, 3 * 24 + 5);
  let short = INITIAL_GAME_STATE;
  for (let index = 0; index < 77; index += 1) short = run(short, 1);

  expect(long.elapsedHours).toBeCloseTo(short.elapsedHours, 5);
  expect(long.calories).toBeCloseTo(short.calories, 5);
  expect(long.fat).toBeCloseTo(short.fat, 5);
});

test('a snack adds calories at once', () => {
  const state = gameReducer(INITIAL_GAME_STATE, { type: 'eatSnack' });
  expect(state.calories).toBe(INITIAL_CALORIES + SNACK_CALORIES);
});

test('a cake lasts 30 game minutes and cannot be restarted meanwhile', () => {
  const started = gameReducer(INITIAL_GAME_STATE, { type: 'enjoyCake' });
  expect(started.cakeUntil).toBeCloseTo(0.5, 5);

  const later = run(started, 0.25);
  expect(gameReducer(later, { type: 'enjoyCake' })).toBe(later);

  const over = run(later, 0.5);
  const again = gameReducer(over, { type: 'enjoyCake' });
  expect(again.cakeUntil).toBeGreaterThan(over.elapsedHours);
});

test('speeds up and slows down within the available speeds', () => {
  let state = INITIAL_GAME_STATE;
  for (let index = 0; index < SPEEDS.length; index += 1) {
    state = gameReducer(state, { type: 'speedUp' });
  }
  expect(SPEEDS[state.speedIndex]).toBe(SPEEDS.at(-1));

  for (let index = 0; index < SPEEDS.length * 2; index += 1) {
    state = gameReducer(state, { type: 'slowDown' });
  }
  expect(SPEEDS[state.speedIndex]).toBe(SPEEDS[0]);
});

test('a speed change never moves the time already elapsed', () => {
  const before = run(INITIAL_GAME_STATE, 4);
  const after = gameReducer(before, { type: 'speedUp' });
  expect(after.elapsedHours).toBe(before.elapsedHours);

  const faster = gameReducer(after, {
    type: 'elapse',
    seconds: hoursToSeconds(3),
  });
  expect(faster.elapsedHours - after.elapsedHours).toBeCloseTo(6, 5);
});

test('the brain fills during the day and empties during the night', () => {
  // Monday 00:00 to 07:00: the rest of the night empties the gauge
  const morning = run(INITIAL_GAME_STATE, 7);
  expect(morning.brain).toBeCloseTo(0, 5);

  // 16 hours awake fill it
  const evening = run(morning, 16);
  expect(evening.brain).toBeCloseTo(100, 5);
});
