import { useEffect } from 'react';

import { HOURS_PER_SECOND } from '@game/time';

// While `isRunning`, calls `onTick` on every frame with the game hours that
// went by since the last one. A tab in the background has no frame: the whole
// delay comes at once when it is back, and nothing is capped (ADR 0002).
export const useActionClock = (
  isRunning: boolean,
  onTick: (hours: number) => void,
) => {
  useEffect(() => {
    if (!isRunning) return;
    let last = performance.now();
    let frame = 0;
    const loop = () => {
      const now = performance.now();
      onTick(((now - last) / 1000) * HOURS_PER_SECOND);
      last = now;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isRunning, onTick]);
};
