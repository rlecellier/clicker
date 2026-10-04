import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { HOURS_PER_SECOND, HOURS_PER_WEEK } from './constants';
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
  expect(result.current).toEqual({ week: 0, weekHour: 0 });
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
