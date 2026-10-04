import { useRef, type TouchEvent } from 'react';

// Fingers must travel this many pixels sideways to count as a swipe.
const MIN_DISTANCE = 50;

type SwipeOptions = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

// Touch handlers to spread on an element: a horizontal swipe calls the left or
// right callback. Mostly vertical gestures are left to the page scroll.
export const useSwipe = ({ onSwipeLeft, onSwipeRight }: SwipeOptions) => {
  const start = useRef<{ x: number; y: number } | undefined>(undefined);

  return {
    onTouchStart: (event: TouchEvent) => {
      const touch = event.touches[0];
      // a second finger makes it a pinch, not a swipe
      start.current =
        touch && event.touches.length === 1
          ? { x: touch.clientX, y: touch.clientY }
          : undefined;
    },
    onTouchEnd: (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      const origin = start.current;
      start.current = undefined;
      if (touch === undefined || origin === undefined) return;
      const dx = touch.clientX - origin.x;
      const dy = touch.clientY - origin.y;
      if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    },
  };
};
