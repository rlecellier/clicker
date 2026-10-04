import { payBetween } from '@game/earnings';
import {
  addExpenses,
  expensesBetween,
  totalExpensesCents,
} from '@game/expenses';
import {
  eatSnack,
  isEnjoyingCake,
  startCake,
  stepNutrition,
} from '@game/nutrition';
import { readingHoursBetween, stepReading, toggleReading } from '@game/reading';
import { stepSleep } from '@game/sleep';
import { HOURS_PER_SECOND, SPEEDS } from '@game/time';
import { newGameState, type GameState } from './types';

export type GameAction =
  // real seconds went by: the game runs at its current speed
  | { type: 'elapse'; seconds: number }
  | { type: 'eatSnack' }
  | { type: 'enjoyCake' }
  // `roll` in [0, 1) draws the book when none is on the go
  | { type: 'toggleReading'; roll: number }
  | { type: 'speedUp' }
  | { type: 'slowDown' }
  // a brand new game, whatever the current one
  | { type: 'restart'; birthDate: string };

// Runs `hours` game hours, however many there are: a hidden tab comes back
// with all the time that went by and the game catches up.
const advance = (state: GameState, hours: number): GameState => {
  const from = state.elapsedHours;
  const to = from + hours;
  const paid = expensesBetween(from, to);
  return {
    ...state,
    ...stepNutrition(state, from, to),
    ...stepSleep(state, from, to, readingHoursBetween(state, from, to)),
    ...stepReading(state, from, to),
    elapsedHours: to,
    // the balance can go below zero: the bills are paid anyway
    balanceCents:
      state.balanceCents + payBetween(from, to) - totalExpensesCents(paid),
    expenses: addExpenses(state.expenses, paid),
  };
};

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'elapse': {
      const speed = SPEEDS[state.speedIndex] ?? 1;
      return advance(state, action.seconds * HOURS_PER_SECOND * speed);
    }
    case 'eatSnack': {
      return { ...state, ...eatSnack(state) };
    }
    case 'enjoyCake': {
      return isEnjoyingCake(state, state.elapsedHours)
        ? state
        : { ...state, ...startCake(state, state.elapsedHours) };
    }
    case 'toggleReading': {
      return { ...state, ...toggleReading(state, action.roll) };
    }
    case 'speedUp': {
      return {
        ...state,
        speedIndex: Math.min(state.speedIndex + 1, SPEEDS.length - 1),
      };
    }
    case 'slowDown': {
      return { ...state, speedIndex: Math.max(state.speedIndex - 1, 0) };
    }
    case 'restart': {
      return newGameState(action.birthDate);
    }
  }
};
