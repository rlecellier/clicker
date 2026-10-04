import { useEffect, useState } from 'react';

import { HOURS_PER_SECOND, HOURS_PER_WEEK } from './constants';

// Hours elapsed since the start of the game, as the number of full weeks
// played and the hours since Monday 00:00 of the current week.
export const useWeekClock = () => {
  const [elapsedHours, setElapsedHours] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      setElapsedHours(((now - start) / 1000) * HOURS_PER_SECOND);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return {
    week: Math.floor(elapsedHours / HOURS_PER_WEEK),
    weekHour: elapsedHours % HOURS_PER_WEEK,
  };
};
