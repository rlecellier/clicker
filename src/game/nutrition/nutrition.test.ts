import { expect, test } from 'vitest';

import {
  CALORIES_MAX_TARGET,
  CALORIES_MIN_TARGET,
  IDLE_BURN,
  WORK_BURN,
} from './constants';
import {
  getCaloriesLevel,
  getCaloriesStatus,
  INITIAL_NUTRITION,
  stepNutrition,
} from './nutrition';

const rested = { ...INITIAL_NUTRITION, calories: 50 };

test('calories go down while resting', () => {
  const after = stepNutrition(rested, { kind: 'read', hours: 1 });
  expect(after.calories).toBeCloseTo(50 - IDLE_BURN, 5);
});

test('calories go down faster at work', () => {
  const after = stepNutrition(rested, { kind: 'work', hours: 0.5 });
  expect(after.calories).toBeCloseTo(50 - WORK_BURN * 0.5, 5);
});

test('a meal adds its calories over its duration', () => {
  const after = stepNutrition(rested, {
    kind: 'meal',
    hours: 1,
    calories: 21,
  });
  expect(after.calories).toBeCloseTo(50 + 21 - IDLE_BURN, 1);
});

test('the excess over 80% turns into fat and lowers the calories', () => {
  const after = stepNutrition(
    { ...rested, calories: 95 },
    { kind: 'sleep', hours: 0.5 },
  );
  expect(after.fat).toBeGreaterThan(0);
  expect(after.calories).toBeLessThan(95 - IDLE_BURN * 0.5);
  expect(after.calories + after.fat).toBeCloseTo(95 - IDLE_BURN * 0.5, 1);
});

test('a bigger excess is converted faster', () => {
  const step = { kind: 'sleep', hours: 0.5 } as const;
  const small = stepNutrition({ ...rested, calories: 85 }, step);
  const big = stepNutrition({ ...rested, calories: 100 }, step);
  expect(big.fat).toBeGreaterThan(small.fat * 2);
});

test('a meal over 100% turns the surplus into fat', () => {
  const after = stepNutrition(
    { ...rested, calories: 98 },
    { kind: 'meal', hours: 0.5, calories: 40 },
  );
  expect(after.calories).toBeLessThanOrEqual(100);
  expect(after.calories + after.fat).toBeCloseTo(98 + 40 - IDLE_BURN * 0.5, 1);
});

test('calories never go below zero', () => {
  const after = stepNutrition(
    { ...rested, calories: 1 },
    { kind: 'sleep', hours: 8 },
  );
  expect(after.calories).toBe(0);
});

test('one long action gives the same result as many short ones', () => {
  const long = stepNutrition(rested, { kind: 'sleep', hours: 8 });
  let short = rested;
  for (let hour = 0; hour < 8; hour += 1) {
    short = stepNutrition(short, { kind: 'sleep', hours: 1 });
  }
  expect(long.calories).toBeCloseTo(short.calories, 5);
  expect(long.fat).toBeCloseTo(short.fat, 5);
});

test('calories are low below 20%, high above 80%, balanced in between', () => {
  expect(getCaloriesLevel(19.9)).toBe('low');
  expect(getCaloriesLevel(20)).toBe('balanced');
  expect(getCaloriesLevel(80)).toBe('balanced');
  expect(getCaloriesLevel(80.1)).toBe('high');
  expect(CALORIES_MIN_TARGET).toBeLessThan(CALORIES_MAX_TARGET);
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
