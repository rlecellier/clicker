import { useEffect, useState } from 'react';

import { HOURS_PER_SECOND, HOURS_PER_WEEK } from './constants';

// Hours elapsed since Monday 00:00, wrapping around every week.
export const useWeekClock = () => {
  const [weekHour, setWeekHour] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsedHours = ((now - start) / 1000) * HOURS_PER_SECOND;
      setWeekHour(elapsedHours % HOURS_PER_WEEK);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return weekHour;
};
