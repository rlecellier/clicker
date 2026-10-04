import { isWorkHours, pendingPayCents } from '@game/earnings';
import { locationAt } from '@game/location';
import { isEnjoyingCake } from '@game/nutrition';
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
  pendingPayCents(weekOf(state), weekHourOf(state));

export const isEarning = (state: GameState) => isWorkHours(weekHourOf(state));

export const isEnjoyingCakeNow = (state: GameState) =>
  isEnjoyingCake(state, state.elapsedHours);

export const isSleepingNow = (state: GameState) =>
  isSleeping(weekHourOf(state));

export const locationOf = (state: GameState) => locationAt(weekHourOf(state));
