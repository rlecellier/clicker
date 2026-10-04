import { expect, test } from 'vitest';

import { HOURS_PER_WEEK, SPEEDS } from '@game/time';

import {
  canSlowDown,
  canSpeedUp,
  isEarning,
  pendingPayOf,
  weekHourOf,
  weekOf,
} from './selectors';
import { INITIAL_GAME_STATE, type GameState } from './types';

const at = (elapsedHours: number): GameState => ({
  ...INITIAL_GAME_STATE,
  elapsedHours,
});

test('splits the elapsed hours into a week and an hour of the week', () => {
  expect(weekOf(at(HOURS_PER_WEEK + 3))).toBe(1);
  expect(weekHourOf(at(HOURS_PER_WEEK + 3))).toBe(3);
});

test('is earning during work hours only', () => {
  expect(isEarning(at(10))).toBe(true);
  expect(isEarning(at(12.5))).toBe(false);
});

test('the pay of the week builds up while working', () => {
  expect(pendingPayOf(at(7))).toBe(0);
  expect(pendingPayOf(at(10))).toBeGreaterThan(0);
  expect(pendingPayOf(at(HOURS_PER_WEEK))).toBe(0);
});

test('tells whether the speed can still change', () => {
  const slowest = { ...INITIAL_GAME_STATE, speedIndex: 0 };
  const fastest = { ...INITIAL_GAME_STATE, speedIndex: SPEEDS.length - 1 };
  expect(canSlowDown(slowest)).toBe(false);
  expect(canSpeedUp(slowest)).toBe(true);
  expect(canSpeedUp(fastest)).toBe(false);
  expect(canSlowDown(fastest)).toBe(true);
});
