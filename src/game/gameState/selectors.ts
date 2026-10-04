import { isWorkHours, pendingPayCents } from '@game/earnings';
import { locationAt } from '@game/location';
import { isEnjoyingCake } from '@game/nutrition';
import { getBook, isReadingAt } from '@game/reading';
import { isSleeping } from '@game/sleep';
import { HOURS_PER_WEEK, SPEEDS } from '@game/time';
import type { GameState } from './types';

export const weekOf = (state: GameState) =>
  Math.floor(state.elapsedHours / HOURS_PER_WEEK);

export const weekHourOf = (state: GameState) =>
  state.elapsedHours % HOURS_PER_WEEK;

export const speedOf = (state: GameState) => SPEEDS[state.speedIndex] ?? 1;

export const canSpeedUp = (state: GameState) =>
  state.speedIndex < SPEEDS.length - 1;

export const canSlowDown = (state: GameState) => state.speedIndex > 0;

export const pendingPayOf = (state: GameState) =>
  pendingPayCents(state.job, state.elapsedHours);

export const isEarning = (state: GameState) =>
  isWorkHours(state.job, state.elapsedHours);

export const isEnjoyingCakeNow = (state: GameState) =>
  isEnjoyingCake(state, state.elapsedHours);

export const isSleepingNow = (state: GameState) =>
  isSleeping(state, state.elapsedHours);

export const locationOf = (state: GameState) =>
  locationAt(state, state.elapsedHours);

// Reading right now: a reading event runs on the book on the go.
export const isReadingNow = (state: GameState) =>
  isReadingAt(state, state.elapsedHours) && getBook(state.bookId) !== undefined;

// The `ask` event the game waits on, and its day.
export const askingOf = (state: GameState) => {
  const event = state.plan.find(({ id }) => id === state.asking?.eventId);
  return event && state.asking ? { event, day: state.asking.day } : undefined;
};
