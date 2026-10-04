import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { gameStateFactory } from '@test/factories/gameStateFactory';
import { CLICK_VALUE, WORKING_DAY_DURATION_MS } from './constants';
import { HOURS_PER_WEEK } from '@hook/useWeekClock';
import { useGame } from './useGame';

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
    vi.advanceTimersByTime(18 * 1000);
  });
  expect(result.current.isEarning).toBe(false);
  expect(result.current.pendingPay).toBeGreaterThan(0);
  expect(result.current.money).toBe(0);

  act(() => {
    vi.advanceTimersByTime((HOURS_PER_WEEK - 18) * 1000 + 100);
  });
  expect(result.current.money).toBe(250);
  expect(result.current.pendingPay).toBe(0);
});
