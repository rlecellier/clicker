import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import { useSwipe } from './useSwipe';

const Surface = ({
  onSwipeLeft,
  onSwipeRight,
}: {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) => (
  <div data-testid="surface" {...useSwipe({ onSwipeLeft, onSwipeRight })} />
);

const swipe = (from: [number, number], to: [number, number]) => {
  const onSwipeLeft = vi.fn();
  const onSwipeRight = vi.fn();
  render(<Surface onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} />);
  const surface = screen.getByTestId('surface');
  fireEvent.touchStart(surface, {
    touches: [{ clientX: from[0], clientY: from[1] }],
  });
  fireEvent.touchEnd(surface, {
    changedTouches: [{ clientX: to[0], clientY: to[1] }],
  });
  return { onSwipeLeft, onSwipeRight };
};

test('a swipe to the left calls onSwipeLeft', () => {
  const { onSwipeLeft, onSwipeRight } = swipe([200, 100], [100, 100]);
  expect(onSwipeLeft).toHaveBeenCalledOnce();
  expect(onSwipeRight).not.toHaveBeenCalled();
});

test('a swipe to the right calls onSwipeRight', () => {
  const { onSwipeLeft, onSwipeRight } = swipe([100, 100], [200, 100]);
  expect(onSwipeRight).toHaveBeenCalledOnce();
  expect(onSwipeLeft).not.toHaveBeenCalled();
});

test('ignores a short move', () => {
  const { onSwipeLeft, onSwipeRight } = swipe([100, 100], [120, 100]);
  expect(onSwipeLeft).not.toHaveBeenCalled();
  expect(onSwipeRight).not.toHaveBeenCalled();
});

test('ignores a mostly vertical move', () => {
  const { onSwipeLeft, onSwipeRight } = swipe([100, 100], [20, 300]);
  expect(onSwipeLeft).not.toHaveBeenCalled();
  expect(onSwipeRight).not.toHaveBeenCalled();
});

test('a second finger cancels the swipe, as it is a pinch', () => {
  const onSwipeLeft = vi.fn();
  render(<Surface onSwipeLeft={onSwipeLeft} onSwipeRight={vi.fn()} />);
  const surface = screen.getByTestId('surface');
  fireEvent.touchStart(surface, {
    touches: [
      { clientX: 200, clientY: 0 },
      { clientX: 250, clientY: 0 },
    ],
  });
  fireEvent.touchEnd(surface, {
    changedTouches: [{ clientX: 50, clientY: 0 }],
  });
  expect(onSwipeLeft).not.toHaveBeenCalled();
});
