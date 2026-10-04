import { eventsOnDay, type Schedule } from '@game/calendar';
import { HOURS_PER_DAY, HOURS_PER_WEEK } from '@game/time';

import { MEAL_IDS, MEAL_PRICES_CENTS, WEEKLY_RENT_CENTS } from './constants';

export type MealId = (typeof MEAL_IDS)[number];
export type ExpenseId = 'rent' | MealId;

// Total paid so far for each kind of expense, in integer cents.
export type Expenses = Record<ExpenseId, number>;

export const EXPENSE_IDS: ExpenseId[] = ['rent', ...MEAL_IDS];

export const INITIAL_EXPENSES: Expenses = {
  rent: 0,
  breakfast: 0,
  lunch: 0,
  dinner: 0,
};

const isMealId = (id: string): id is MealId =>
  (MEAL_IDS as readonly string[]).includes(id);

export const totalExpensesCents = (expenses: Expenses) =>
  EXPENSE_IDS.reduce((total, id) => total + expenses[id], 0);

// What gets paid between two game hours: a meal when it starts, the rent when
// a week ends.
export const expensesBetween = (
  schedule: Schedule,
  from: number,
  to: number,
): Expenses => {
  const weeksEnded =
    Math.floor(to / HOURS_PER_WEEK) - Math.floor(from / HOURS_PER_WEEK);
  const paid = { ...INITIAL_EXPENSES, rent: weeksEnded * WEEKLY_RENT_CENTS };
  for (
    let day = Math.floor(from / HOURS_PER_DAY);
    day <= Math.floor(to / HOURS_PER_DAY);
    day += 1
  ) {
    for (const meal of eventsOnDay(schedule, day)) {
      const start = day * HOURS_PER_DAY + meal.start;
      if (
        meal.kind === 'meal' &&
        isMealId(meal.id) &&
        start > from &&
        start <= to
      ) {
        paid[meal.id] += MEAL_PRICES_CENTS[meal.id];
      }
    }
  }
  return paid;
};

export const addExpenses = (a: Expenses, b: Expenses): Expenses => ({
  rent: a.rent + b.rent,
  breakfast: a.breakfast + b.breakfast,
  lunch: a.lunch + b.lunch,
  dinner: a.dinner + b.dinner,
});

// What a full week costs: the rent plus every meal of the plan.
export const weeklyExpensesCents = (schedule: Schedule) =>
  totalExpensesCents(expensesBetween(schedule, 0, HOURS_PER_WEEK));
