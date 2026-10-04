import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { HOURS_PER_WEEK } from '@game/time';

import { DEFAULT_SPEED, HOURS_PER_SECOND, SPEEDS } from './constants';
import { useWeekClock } from './useWeekClock';

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

test('starts on Monday midnight', () => {
  const { result } = renderHook(() => useWeekClock());
  expect(result.current).toMatchObject({ week: 0, weekHour: 0 });
});

test('advances at the default speed', () => {
  const { result } = renderHook(() => useWeekClock());

  act(() => {
    vi.advanceTimersByTime(hoursToMs(5));
  });

  expect(result.current.weekHour).toBeCloseTo(5, 0);
});

test('wraps around after a full week', () => {
  const { result } = renderHook(() => useWeekClock());

  act(() => {
    vi.advanceTimersByTime(hoursToMs(HOURS_PER_WEEK + 3));
  });

  expect(result.current.weekHour).toBeCloseTo(3, 0);
  expect(result.current.week).toBe(1);
});

test('runs eight times faster than real time by default', () => {
  const { result } = renderHook(() => useWeekClock());
  expect(result.current.speed).toBe(DEFAULT_SPEED);
});

test('faster doubles the pace without moving the time already elapsed', () => {
  const { result } = renderHook(() => useWeekClock());

  act(() => {
    vi.advanceTimersByTime(hoursToMs(4));
  });
  const before = result.current.weekHour;

  act(() => {
    result.current.faster();
  });
  expect(result.current.speed).toBe(DEFAULT_SPEED * 2);
  expect(result.current.weekHour).toBeCloseTo(before, 0);

  act(() => {
    vi.advanceTimersByTime(hoursToMs(3));
  });
  expect(result.current.weekHour).toBeCloseTo(before + 3 * 2, 0);
});

test('slower halves the pace', () => {
  const { result } = renderHook(() => useWeekClock());

  act(() => {
    result.current.slower();
  });
  expect(result.current.speed).toBe(DEFAULT_SPEED / 2);

  act(() => {
    vi.advanceTimersByTime(hoursToMs(4));
  });
  expect(result.current.weekHour).toBeCloseTo(2, 0);
});

test('stays within the available speeds', () => {
  const { result } = renderHook(() => useWeekClock());

  act(() => {
    for (let index = 0; index < SPEEDS.length; index++) result.current.faster();
  });
  expect(result.current.speed).toBe(SPEEDS.at(-1));
  expect(result.current.canSpeedUp).toBe(false);

  act(() => {
    for (let index = 0; index < SPEEDS.length * 2; index++)
      result.current.slower();
  });
  expect(result.current.speed).toBe(SPEEDS[0]);
  expect(result.current.canSlowDown).toBe(false);
});
