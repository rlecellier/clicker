import { expect, test } from 'vitest';

import { HOURS_PER_DAY, HOURS_PER_WEEK } from '@game/time';
import { WORKING_SCHEDULE } from '@test/schedules';

import {
  CALORIES_CAP,
  CALORIES_MAX_TARGET,
  CALORIES_MIN_TARGET,
  CAKE_CALORIES,
  IDLE_BURN,
  INITIAL_CALORIES,
  SNACK_CALORIES,
  WORK_BURN,
} from './constants';
import {
  eatSnack,
  getCaloriesLevel,
  getCaloriesStatus,
  INITIAL_NUTRITION,
  isEnjoyingCake,
  startCake,
  stepNutrition,
} from './nutrition';

const at = (day: number, hour: number) => day * HOURS_PER_DAY + hour;
const rested = { ...INITIAL_NUTRITION, ...WORKING_SCHEDULE, calories: 50 };

test('calories go down while resting', () => {
  // Saturday 22:00 to 23:00: no meal, no work
  const after = stepNutrition(rested, at(5, 22), at(5, 23));
  expect(after.calories).toBeCloseTo(50 - IDLE_BURN, 5);
});

test('calories go down faster at work', () => {
  // Monday 09:00 to 10:00
  const after = stepNutrition(rested, at(0, 9), at(0, 10));
  expect(after.calories).toBeCloseTo(50 - WORK_BURN, 5);
});

test('a meal adds its calories while it runs', () => {
  // Lunch: 21% over one hour, minus the resting burn, on a weekend day
  const after = stepNutrition(rested, at(5, 12), at(5, 13));
  expect(after.calories).toBeCloseTo(50 + 21 - IDLE_BURN, 1);
});

test('meals happen every day, work only on weekdays', () => {
  const sunday = stepNutrition(rested, at(6, 7), at(6, 7.5));
  expect(sunday.calories).toBeCloseTo(50 + 15 - IDLE_BURN * 0.5, 1);
});

test('a snack adds calories at once', () => {
  expect(eatSnack(rested).calories).toBe(50 + SNACK_CALORIES);
});

test('a snack over 100% turns the surplus into fat', () => {
  const after = eatSnack({ ...rested, calories: 95 });
  expect(after.calories).toBe(CALORIES_CAP);
  expect(after.fat).toBe(95 + SNACK_CALORIES - CALORIES_CAP);
});

test('the excess over 80% turns into fat and lowers the calories', () => {
  const after = stepNutrition(
    { ...rested, calories: 95 },
    at(5, 22),
    at(5, 22.5),
  );
  expect(after.fat).toBeGreaterThan(0);
  expect(after.calories).toBeLessThan(95 - IDLE_BURN * 0.5);
  expect(after.calories + after.fat).toBeCloseTo(95 - IDLE_BURN * 0.5, 1);
});

test('a bigger excess is converted faster', () => {
  const small = stepNutrition(
    { ...rested, calories: 85 },
    at(5, 22),
    at(5, 22.5),
  );
  const big = stepNutrition(
    { ...rested, calories: 100 },
    at(5, 22),
    at(5, 22.5),
  );
  expect(big.fat).toBeGreaterThan(small.fat * 2);
});

test('calories never go below zero', () => {
  const after = stepNutrition({ ...rested, calories: 1 }, at(5, 22), at(5, 23));
  expect(after.calories).toBe(0);
});

test('a cake adds calories for 30 game minutes, at work too', () => {
  const cake = { ...rested, ...startCake(rested, at(0, 9)) };
  expect(isEnjoyingCake(cake, at(0, 9.25))).toBe(true);
  expect(isEnjoyingCake(cake, at(0, 9.5))).toBe(false);

  const after = stepNutrition(cake, at(0, 9), at(0, 10));
  expect(after.calories + after.fat).toBeCloseTo(
    50 + CAKE_CALORIES - WORK_BURN,
    1,
  );
});

test('a long frame gives the same result as many short ones', () => {
  const long = stepNutrition(rested, at(0, 0), at(3, 0));
  let short = rested;
  for (let hour = 0; hour < 72; hour += 1) {
    short = { ...short, ...stepNutrition(short, hour, hour + 1) };
  }
  expect(long.calories).toBeCloseTo(short.calories, 5);
  expect(long.fat).toBeCloseTo(short.fat, 5);
  expect(long.calories).toBeLessThanOrEqual(CALORIES_MAX_TARGET + 1);
});

test('calories are low below 20%, high above 80%, balanced in between', () => {
  expect(getCaloriesLevel(19.9)).toBe('low');
  expect(getCaloriesLevel(20)).toBe('balanced');
  expect(getCaloriesLevel(80)).toBe('balanced');
  expect(getCaloriesLevel(80.1)).toBe('high');
});

test('status is green between 40% and 60%, yellow up to 20% and 80%, red beyond', () => {
  expect(getCaloriesStatus(19.9)).toBe('starving');
  expect(getCaloriesStatus(20)).toBe('running-low');
  expect(getCaloriesStatus(39.9)).toBe('running-low');
  expect(getCaloriesStatus(40)).toBe('good');
  expect(getCaloriesStatus(60)).toBe('good');
  expect(getCaloriesStatus(60.1)).toBe('running-high');
  expect(getCaloriesStatus(80)).toBe('running-high');
  expect(getCaloriesStatus(80.1)).toBe('overflowing');
});

test('without any snack or cake, the meals and the burn cancel out each week', () => {
  let state = { ...INITIAL_NUTRITION, ...WORKING_SCHEDULE };
  for (let week = 0; week < 12; week += 1) {
    let low = state.calories;
    let high = state.calories;
    for (let hour = 0; hour < HOURS_PER_WEEK; hour += 0.25) {
      const from = week * HOURS_PER_WEEK + hour;
      state = { ...state, ...stepNutrition(state, from, from + 0.25) };
      low = Math.min(low, state.calories);
      high = Math.max(high, state.calories);
    }
    expect(state.calories).toBeCloseTo(INITIAL_CALORIES, 5);
    expect(state.fat).toBe(0);
    expect(low).toBeGreaterThanOrEqual(CALORIES_MIN_TARGET);
    expect(high).toBeLessThanOrEqual(CALORIES_MAX_TARGET);
  }
});
