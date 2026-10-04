import { EVENTS } from '@game/calendar';
import { DAYS_PER_WEEK, HOURS_PER_DAY, HOURS_PER_WEEK } from '@game/time';

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

const MEALS = MEAL_IDS.map((id) => {
  const event = EVENTS.find((candidate) => candidate.id === id);
  if (event === undefined) throw new Error(`No "${id}" event in the calendar`);
  return event;
});

export const totalExpensesCents = (expenses: Expenses) =>
  EXPENSE_IDS.reduce((total, id) => total + expenses[id], 0);

// What gets paid between two game hours: a meal when it starts, the rent when
// a week ends.
export const expensesBetween = (from: number, to: number): Expenses => {
  const weeksEnded =
    Math.floor(to / HOURS_PER_WEEK) - Math.floor(from / HOURS_PER_WEEK);
  const paid = { ...INITIAL_EXPENSES, rent: weeksEnded * WEEKLY_RENT_CENTS };
  for (const meal of MEALS) {
    for (
      let day = Math.floor(from / HOURS_PER_DAY);
      day <= Math.floor(to / HOURS_PER_DAY);
      day += 1
    ) {
      const start = day * HOURS_PER_DAY + meal.start;
      const isMealDay = meal.days.includes(day % DAYS_PER_WEEK);
      if (isMealDay && start > from && start <= to) {
        paid[meal.id as MealId] += MEAL_PRICES_CENTS[meal.id as MealId];
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

// What a full week costs: the rent plus every meal of the calendar.
export const weeklyExpensesCents = () =>
  totalExpensesCents(expensesBetween(0, HOURS_PER_WEEK));
