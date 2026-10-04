import { weeklyPayCents } from '@game/earnings';
import {
  eatSnack,
  isEnjoyingCake,
  startCake,
  stepNutrition,
} from '@game/nutrition';
import { HOURS_PER_SECOND, HOURS_PER_WEEK, SPEEDS } from '@game/time';
import type { GameState } from './types';

export type GameAction =
  // real seconds went by: the game runs at its current speed
  | { type: 'elapse'; seconds: number }
  | { type: 'eatSnack' }
  | { type: 'enjoyCake' }
  | { type: 'speedUp' }
  | { type: 'slowDown' };

// Pay of the weeks that ended between two game hours.
const paySince = (from: number, to: number) => {
  let pay = 0;
  const lastWeek = Math.floor(to / HOURS_PER_WEEK);
  for (
    let week = Math.floor(from / HOURS_PER_WEEK);
    week < lastWeek;
    week += 1
  ) {
    pay += weeklyPayCents(week);
  }
  return pay;
};

// Runs `hours` game hours, however many there are: a hidden tab comes back
// with all the time that went by and the game catches up.
const advance = (state: GameState, hours: number): GameState => {
  const from = state.elapsedHours;
  const to = from + hours;
  return {
    ...state,
    ...stepNutrition(state, from, to),
    elapsedHours: to,
    balanceCents: state.balanceCents + paySince(from, to),
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
    case 'speedUp': {
      return {
        ...state,
        speedIndex: Math.min(state.speedIndex + 1, SPEEDS.length - 1),
      };
    }
    case 'slowDown': {
      return { ...state, speedIndex: Math.max(state.speedIndex - 1, 0) };
    }
  }
};
