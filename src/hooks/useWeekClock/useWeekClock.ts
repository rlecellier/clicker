import { useCallback, useEffect, useRef, useState } from 'react';

import {
  DEFAULT_SPEED_INDEX,
  HOURS_PER_SECOND,
  HOURS_PER_WEEK,
  SPEEDS,
} from './constants';

type UseWeekClockOptions = {
  // called on every frame with the game hours the frame covers; a long frame
  // (hidden tab) covers all the time that went by, so the game keeps going
  onTick?: (from: number, to: number) => void;
};

// Hours elapsed since the start of the game, as the number of full weeks
// played and the hours since Monday 00:00 of the current week. The speed can
// be changed on the fly: time already elapsed is never rewritten.
export const useWeekClock = ({ onTick }: UseWeekClockOptions = {}) => {
  const [elapsedHours, setElapsedHours] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(DEFAULT_SPEED_INDEX);
  const speed = SPEEDS[speedIndex] ?? 1;

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const onTickRef = useRef(onTick);
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    let last = performance.now();
    let elapsed = 0;
    let frame = 0;
    const tick = (now: number) => {
      const previous = elapsed;
      elapsed += ((now - last) / 1000) * HOURS_PER_SECOND * speedRef.current;
      last = now;
      onTickRef.current?.(previous, elapsed);
      setElapsedHours(elapsed);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  const faster = useCallback(() => {
    setSpeedIndex((index) => Math.min(index + 1, SPEEDS.length - 1));
  }, []);

  const slower = useCallback(() => {
    setSpeedIndex((index) => Math.max(index - 1, 0));
  }, []);

  return {
    elapsedHours,
    week: Math.floor(elapsedHours / HOURS_PER_WEEK),
    weekHour: elapsedHours % HOURS_PER_WEEK,
    speed,
    canSpeedUp: speedIndex < SPEEDS.length - 1,
    canSlowDown: speedIndex > 0,
    faster,
    slower,
  };
};
