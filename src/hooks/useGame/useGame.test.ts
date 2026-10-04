import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { gameStateFactory } from '@test/factories/gameStateFactory';
import { INITIAL_CALORIES, SNACK_CALORIES } from './constants';
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

test('a snack adds calories at once', () => {
  const { result } = renderHook(() => useGame());
  const before = result.current.calories;

  act(() => {
    result.current.snack();
  });

  expect(result.current.calories).toBe(before + SNACK_CALORIES);
});

test('calories go down during the night', () => {
  const { result } = renderHook(() => useGame());

  act(() => {
    vi.advanceTimersByTime(hoursToMs(6));
  });

  expect(result.current.calories).toBeLessThan(INITIAL_CALORIES);
});

test('enjoying a cake lasts 30 game minutes and cannot be restarted', () => {
  const { result } = renderHook(() => useGame());

  act(() => {
    result.current.cake();
  });
  act(() => {
    vi.advanceTimersByTime(hoursToMs(0.25));
  });
  expect(result.current.isEnjoyingCake).toBe(true);

  act(() => {
    vi.advanceTimersByTime(hoursToMs(0.5));
  });
  expect(result.current.isEnjoyingCake).toBe(false);
});

test('the game keeps going after a long frame, like a hidden tab', () => {
  const { result } = renderHook(() => useGame());

  act(() => {
    vi.advanceTimersByTime(hoursToMs(HOURS_PER_WEEK / 2));
  });
  expect(result.current.weekHour).toBeCloseTo(HOURS_PER_WEEK / 2, 0);
  expect(result.current.calories).toBeGreaterThanOrEqual(0);
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
