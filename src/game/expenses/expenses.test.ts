import { expect, test } from 'vitest';

import { HOURS_PER_DAY, HOURS_PER_WEEK } from '@game/time';
import { WORKING_SCHEDULE } from '@test/schedules';

import { MEAL_PRICES_CENTS, WEEKLY_RENT_CENTS } from './constants';
import {
  addExpenses,
  expensesBetween,
  INITIAL_EXPENSES,
  totalExpensesCents,
  weeklyExpensesCents,
} from './expenses';

test('pays nothing while no meal starts and no week ends', () => {
  expect(expensesBetween(WORKING_SCHEDULE, 0, 6.9)).toEqual(INITIAL_EXPENSES);
});

test('pays a meal when it starts', () => {
  expect(expensesBetween(WORKING_SCHEDULE, 6.9, 7)).toMatchObject({
    breakfast: MEAL_PRICES_CENTS.breakfast,
    lunch: 0,
  });
  expect(expensesBetween(WORKING_SCHEDULE, 7, 7.5).breakfast).toBe(0);
});

test('pays the three meals of every day', () => {
  const day = expensesBetween(WORKING_SCHEDULE, 0, HOURS_PER_DAY);
  expect(day).toMatchObject({
    breakfast: MEAL_PRICES_CENTS.breakfast,
    lunch: MEAL_PRICES_CENTS.lunch,
    dinner: MEAL_PRICES_CENTS.dinner,
    rent: 0,
  });
});

test('pays the rent when the week ends, once', () => {
  expect(
    expensesBetween(WORKING_SCHEDULE, HOURS_PER_WEEK - 1, HOURS_PER_WEEK).rent,
  ).toBe(WEEKLY_RENT_CENTS);
  expect(
    expensesBetween(WORKING_SCHEDULE, HOURS_PER_WEEK, HOURS_PER_WEEK + 1).rent,
  ).toBe(0);
});

test('catches up with every expense of a long time away', () => {
  const twoWeeks = expensesBetween(WORKING_SCHEDULE, 0, 2 * HOURS_PER_WEEK);
  expect(twoWeeks.rent).toBe(2 * WEEKLY_RENT_CENTS);
  expect(twoWeeks.lunch).toBe(14 * MEAL_PRICES_CENTS.lunch);
});

test('adds and totals expenses', () => {
  const sum = addExpenses(
    { rent: 1, breakfast: 2, lunch: 3, dinner: 4 },
    { rent: 10, breakfast: 20, lunch: 30, dinner: 40 },
  );
  expect(sum).toEqual({ rent: 11, breakfast: 22, lunch: 33, dinner: 44 });
  expect(totalExpensesCents(sum)).toBe(110);
});

test('a full week costs the rent plus every meal', () => {
  expect(weeklyExpensesCents(WORKING_SCHEDULE)).toBe(
    totalExpensesCents(expensesBetween(WORKING_SCHEDULE, 0, 168)),
  );
  expect(weeklyExpensesCents(WORKING_SCHEDULE)).toBeGreaterThan(8000);
});

test('a declined meal is not paid', () => {
  const skipped = { ...WORKING_SCHEDULE, declined: ['lunch@0'] };
  expect(expensesBetween(skipped, 0, HOURS_PER_DAY).lunch).toBe(0);
  expect(expensesBetween(skipped, 0, HOURS_PER_DAY).dinner).toBe(
    MEAL_PRICES_CENTS.dinner,
  );
});
