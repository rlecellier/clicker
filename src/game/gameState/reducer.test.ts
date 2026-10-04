import { expect, test } from 'vitest';

import {
  MEAL_PRICES_CENTS,
  totalExpensesCents,
  WEEKLY_RENT_CENTS,
} from '@game/expenses';
import { INITIAL_CALORIES, SNACK_CALORIES } from '@game/nutrition';
import {
  DEFAULT_SPEED,
  HOURS_PER_SECOND,
  HOURS_PER_WEEK,
  SPEEDS,
} from '@game/time';

import { EVENING_READING, WORKING_STATE } from '@test/schedules';

import { gameReducer } from './reducer';
import { INITIAL_GAME_STATE, type GameState } from './types';

// Real seconds needed for the game to run the given number of hours.
const hoursToSeconds = (hours: number) =>
  hours / (HOURS_PER_SECOND * DEFAULT_SPEED);

const WORKING: GameState = { ...INITIAL_GAME_STATE, ...WORKING_STATE };

const run = (state: GameState, hours: number) =>
  gameReducer(state, {
    type: 'elapse',
    seconds: hoursToSeconds(hours),
    roll: 0,
  });

// Salary banked so far: the balance before the bills were paid.
const earnedCents = (state: GameState) =>
  state.balanceCents + totalExpensesCents(state.expenses);

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

test('pays nothing without a job', () => {
  const state = run(INITIAL_GAME_STATE, 2 * HOURS_PER_WEEK);
  expect(earnedCents(state)).toBe(0);
});

test('pays the weekly salary once the week is over, not before', () => {
  const midWeek = run(WORKING, HOURS_PER_WEEK - 1);
  expect(earnedCents(midWeek)).toBe(0);

  const nextWeek = run(midWeek, 2);
  expect(earnedCents(nextWeek)).toBe(25_000);
});

test('pays every week that went by in a long frame', () => {
  // Weeks 0 to 3 are in February, a 28-day month.
  const state = run(WORKING, 4 * HOURS_PER_WEEK + 1);
  expect(earnedCents(state)).toBe(4 * 25_000);
});

test('a long frame gives the same result as many short ones', () => {
  const long = run(WORKING, 3 * 24 + 5);
  let short = WORKING;
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
    roll: 0,
  });
  expect(faster.elapsedHours - after.elapsedHours).toBeCloseTo(6, 5);
});

test('the brain fills during the day and empties during the night', () => {
  // Monday 00:00 to 07:00: the rest of the night empties the gauge
  const morning = run(WORKING, 7);
  expect(morning.brain).toBeCloseTo(0, 5);
  expect(morning.dreams).toBe(0);

  // a working day fills about a third of it
  const evening = run(morning, 16);
  expect(evening.brain).toBeGreaterThan(25);
  expect(evening.brain).toBeLessThan(40);

  // the night empties it and what is left over fills the dream gauge
  const nextMorning = run(evening, 8);
  expect(nextMorning.brain).toBeCloseTo(0, 5);
  expect(nextMorning.dreamGauge).toBeCloseTo(80 - evening.brain, 5);
});

test('pays each meal when it starts', () => {
  const state = run(INITIAL_GAME_STATE, 7.5);
  expect(state.expenses.breakfast).toBe(MEAL_PRICES_CENTS.breakfast);
  expect(state.balanceCents).toBe(-MEAL_PRICES_CENTS.breakfast);
});

test('pays the rent when the week ends and keeps the bills in the balance', () => {
  const state = run(WORKING, HOURS_PER_WEEK + 1);
  expect(state.expenses.rent).toBe(WEEKLY_RENT_CENTS);
  expect(state.balanceCents).toBe(25_000 - totalExpensesCents(state.expenses));
});

test('restarts a brand new game, whatever the current one', () => {
  const played = gameReducer(run(INITIAL_GAME_STATE, 100), {
    type: 'eatSnack',
  });
  expect(played).not.toEqual(INITIAL_GAME_STATE);
  expect(
    gameReducer(played, { type: 'restart', birthDate: '2008-10-04' }),
  ).toEqual({ ...INITIAL_GAME_STATE, birthDate: '2008-10-04' });
});

test('the book moves during the reading events', () => {
  const reader = gameReducer(WORKING, {
    type: 'planEvent',
    event: EVENING_READING,
  });
  // Monday 00:00 to 22:00: the reading event runs from 20:00
  const evening = run(reader, 22);
  // the reading event draws the first book of the library (roll 0)
  expect(evening.bookId).toBe('animal-farm');
  expect(evening.bookHours).toBeCloseTo(2, 5);
  // without a reading event the book stays where it is
  expect(run(WORKING, 22).bookHours).toBe(0);
});

test('the brain fills faster while reading', () => {
  const reader = gameReducer(WORKING, {
    type: 'planEvent',
    event: EVENING_READING,
  });
  expect(run(reader, 22).brain).toBeGreaterThan(run(WORKING, 22).brain);
});

test('taking a job plans the work, and the pay starts at the hire', () => {
  const hired = gameReducer(run(INITIAL_GAME_STATE, 2 * 24 + 8), {
    type: 'takeJob',
    jobId: 'clothes-seller',
  });
  expect(hired.job).toEqual({ id: 'clothes-seller', since: 2 * 24 + 8 });
  expect(hired.plan.map((event) => event.title)).toContain('Go to work');
  expect(earnedCents(run(hired, HOURS_PER_WEEK))).toBe(15_000);
});

test('a job is taken once', () => {
  const again = gameReducer(WORKING, {
    type: 'takeJob',
    jobId: 'clothes-seller',
  });
  expect(again).toBe(WORKING);
});

test('plans an event that fits, with an id of its own', () => {
  const planned = gameReducer(WORKING, {
    type: 'planEvent',
    event: EVENING_READING,
  });
  expect(planned.plan).toHaveLength(WORKING.plan.length + 1);
  const ids = planned.plan.map((event) => event.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test('refuses an event that overlaps the plan', () => {
  const clash = gameReducer(WORKING, {
    type: 'planEvent',
    event: { ...EVENING_READING, start: 9, end: 10 },
  });
  expect(clash).toBe(WORKING);
});

const ASKING: GameState = {
  ...WORKING,
  plan: [
    ...WORKING.plan,
    { ...EVENING_READING, id: 'read-ask', mode: 'ask' as const },
  ],
};

test('the game stops where an ask event starts and waits for the answer', () => {
  const stopped = run(ASKING, 30);
  expect(stopped.asking).toEqual({ eventId: 'read-ask', day: 0 });
  expect(stopped.elapsedHours).toBe(20);
  // time does not move while waiting
  expect(run(stopped, 5)).toBe(stopped);
});

test('accepting an ask event lets it run', () => {
  const stopped = run(ASKING, 30);
  const accepted = gameReducer(stopped, {
    type: 'answerAsk',
    isAccepted: true,
  });
  expect(accepted.asking).toBeUndefined();
  expect(run(accepted, 3).bookHours).toBeCloseTo(3, 5);
  // the next day asks again
  expect(run(accepted, 30).asking).toEqual({ eventId: 'read-ask', day: 1 });
});

test('declining an ask event skips that occurrence only', () => {
  const stopped = run(ASKING, 30);
  const declined = gameReducer(stopped, {
    type: 'answerAsk',
    isAccepted: false,
  });
  expect(declined.declined).toEqual(['read-ask@0']);
  expect(run(declined, 3).bookHours).toBe(0);
  expect(run(declined, 30).asking).toEqual({ eventId: 'read-ask', day: 1 });
});

test('an ask event planned while it should run asks at once', () => {
  const evening = run(WORKING, 21);
  const planned = gameReducer(evening, {
    type: 'planEvent',
    event: { ...EVENING_READING, mode: 'ask' },
  });
  expect(planned.asking).toEqual({
    eventId: planned.plan.at(-1)?.id,
    day: 0,
  });
  // an auto one just runs
  const auto = gameReducer(evening, {
    type: 'planEvent',
    event: EVENING_READING,
  });
  expect(auto.asking).toBeUndefined();
});

test('forgets the declined occurrences of the days gone by', () => {
  const stopped = run(ASKING, 30);
  const declined = gameReducer(stopped, {
    type: 'answerAsk',
    isAccepted: false,
  });
  expect(run(declined, 24).declined).toEqual([]);
});

test('answering with no question changes nothing', () => {
  expect(gameReducer(WORKING, { type: 'answerAsk', isAccepted: true })).toBe(
    WORKING,
  );
});
