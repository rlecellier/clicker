import { act, renderHook } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import { useMediaQuery } from './useMediaQuery';

// A media query that can be flipped from the test.
const mockMatchMedia = (isMatching: boolean) => {
  let isCurrentlyMatching = isMatching;
  const listeners = new Set<() => void>();
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return isCurrentlyMatching;
    },
    addEventListener: (_: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) =>
      listeners.delete(listener),
  }));
  return (isNowMatching: boolean) => {
    isCurrentlyMatching = isNowMatching;
    for (const listener of listeners) listener();
  };
};

test('tells whether the query matches', () => {
  mockMatchMedia(true);
  const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'));
  expect(result.current).toBe(true);
});

test('follows the query when it changes', () => {
  const setMatching = mockMatchMedia(false);
  const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'));
  expect(result.current).toBe(false);
  act(() => {
    setMatching(true);
  });
  expect(result.current).toBe(true);
});
