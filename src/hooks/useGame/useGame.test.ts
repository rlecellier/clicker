import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { gameStateFactory } from '@test/factories/gameStateFactory';
import { CLICK_VALUE, WORKING_DAY_DURATION_MS } from './constants';
import {
  DEFAULT_SPEED,
  HOURS_PER_SECOND,
  HOURS_PER_WEEK,
} from '@hook/useWeekClock';
import { useGame } from './useGame';

// Real milliseconds needed for the game to run the given number of hours.
const hoursToMs = (hours: number) =>
  (hours * 1000) / (HOURS_PER_SECOND * DEFAULT_SPEED);

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
  });
});

afterEach(() => {
  vi.useRealTimers();
});

test('starts with the given state', () => {
  const state = gameStateFactory.build();
  const { result } = renderHook(() => useGame(state));
  expect(result.current.money).toBe(state.money);
});

test('starts broke by default', () => {
  const { result } = renderHook(() => useGame());
  expect(result.current.money).toBe(0);
});

test('work adds one click value to the current money', () => {
  const state = gameStateFactory.build();
  const { result } = renderHook(() => useGame(state));

  act(() => {
    result.current.work();
  });

  expect(result.current.money).toBe(state.money + CLICK_VALUE);
});

test('work is ignored during a working day', () => {
  const state = gameStateFactory.build({ traits: ['broke'] });
  const { result } = renderHook(() => useGame(state));

  act(() => {
    result.current.startWorkingDay();
  });
  act(() => {
    result.current.work();
  });

  expect(result.current.isWorkingDay).toBe(true);
  expect(result.current.money).toBe(0);
});

test('a working day pays ten clicks once it ends', () => {
  const state = gameStateFactory.build();
  const { result } = renderHook(() => useGame(state));

  act(() => {
    result.current.startWorkingDay();
  });
  act(() => {
    vi.advanceTimersByTime(WORKING_DAY_DURATION_MS + 100);
  });

  expect(result.current.isWorkingDay).toBe(false);
  expect(result.current.money).toBe(state.money + 10 * CLICK_VALUE);
});

test('earns the weekly pay while working, banked once the week ends', () => {
  const { result } = renderHook(() => useGame({ money: 0 }));

  act(() => {
    vi.advanceTimersByTime(hoursToMs(18.5));
  });
  expect(result.current.isEarning).toBe(false);
  expect(result.current.pendingPay).toBeGreaterThan(0);
  expect(result.current.money).toBe(0);

  act(() => {
    vi.advanceTimersByTime(hoursToMs(HOURS_PER_WEEK - 18.5) + 100);
  });
  expect(result.current.money).toBe(250);
  expect(result.current.pendingPay).toBe(0);
});

test('speeding up the time brings the end of the week closer', () => {
  const { result } = renderHook(() => useGame({ money: 0 }));

  act(() => {
    result.current.faster();
  });
  act(() => {
    vi.advanceTimersByTime(hoursToMs(HOURS_PER_WEEK / 2) + 100);
  });

  expect(result.current.money).toBe(250);
});
