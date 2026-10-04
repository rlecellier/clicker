import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { HOURS_PER_SECOND, HOURS_PER_WEEK, SPEEDS } from './constants';
import { useWeekClock } from './useWeekClock';

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

test('advances one hour per second', () => {
  const { result } = renderHook(() => useWeekClock());

  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(result.current.weekHour).toBeCloseTo(5 * HOURS_PER_SECOND, 0);
});

test('wraps around after a full week', () => {
  const { result } = renderHook(() => useWeekClock());

  act(() => {
    vi.advanceTimersByTime((HOURS_PER_WEEK + 3) * 1000);
  });

  expect(result.current.weekHour).toBeCloseTo(3, 0);
  expect(result.current.week).toBe(1);
});

test('runs at normal speed by default', () => {
  const { result } = renderHook(() => useWeekClock());
  expect(result.current.speed).toBe(1);
});

test('faster doubles the pace without moving the time already elapsed', () => {
  const { result } = renderHook(() => useWeekClock());

  act(() => {
    vi.advanceTimersByTime(4000);
  });
  const before = result.current.weekHour;

  act(() => {
    result.current.faster();
  });
  expect(result.current.speed).toBe(2);
  expect(result.current.weekHour).toBeCloseTo(before, 0);

  act(() => {
    vi.advanceTimersByTime(3000);
  });
  expect(result.current.weekHour).toBeCloseTo(before + 3 * 2, 0);
});

test('slower halves the pace', () => {
  const { result } = renderHook(() => useWeekClock());

  act(() => {
    result.current.slower();
  });
  expect(result.current.speed).toBe(0.5);

  act(() => {
    vi.advanceTimersByTime(4000);
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
