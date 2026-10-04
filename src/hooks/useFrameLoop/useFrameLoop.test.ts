import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { useFrameLoop } from './useFrameLoop';

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
  });
});

afterEach(() => {
  vi.useRealTimers();
});

test('reports the real seconds that went by since the last frame', () => {
  const onFrame = vi.fn<(seconds: number) => void>();
  renderHook(() => {
    useFrameLoop(onFrame);
  });

  vi.advanceTimersByTime(1000);

  const total = onFrame.mock.calls.reduce((sum, [seconds]) => sum + seconds, 0);
  expect(total).toBeCloseTo(1, 1);
});

test('stops once unmounted', () => {
  const onFrame = vi.fn<(seconds: number) => void>();
  const { unmount } = renderHook(() => {
    useFrameLoop(onFrame);
  });
  vi.advanceTimersByTime(100);
  unmount();
  onFrame.mockClear();

  vi.advanceTimersByTime(100);

  expect(onFrame).not.toHaveBeenCalled();
});
