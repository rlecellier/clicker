import { formatClock } from './clock';
import { HOURS_PER_DAY } from './constants';
import { dayOfMonth, monthLabel, weekdayLabel, yearOf } from './dates';

// The date and the time of day of a game hour: "Mon 5 Oct 2026" and "14:30".
export const momentOf = (origin: number, elapsedHours: number) => {
  const day = Math.floor(elapsedHours / HOURS_PER_DAY);
  return {
    date: `${weekdayLabel(origin, day)} ${dayOfMonth(origin, day)} ${monthLabel(origin, day)} ${yearOf(origin, day)}`,
    time: formatClock(elapsedHours % HOURS_PER_DAY),
  };
};
