import { HOURS_PER_DAY, HOURS_PER_WEEK } from '@game/time';

import { EVENTS } from './events';
import type { CalendarEvent } from './types';

// The event running at a given hour of the week, if any.
export const eventAt = (weekHour: number) => {
  const day = Math.floor(weekHour / HOURS_PER_DAY);
  const hour = weekHour % HOURS_PER_DAY;
  return EVENTS.find(
    (event) =>
      event.days.includes(day) && hour >= event.start && hour < event.end,
  );
};

// The next event to start after a given hour of the week, and the hours left
// before it starts. The week repeats, so Sunday night leads to Monday morning.
export const nextEventAfter = (weekHour: number) => {
  let soonest: { event: CalendarEvent; startsIn: number } | undefined;
  for (const event of EVENTS) {
    for (const day of event.days) {
      const delta = day * HOURS_PER_DAY + event.start - weekHour;
      const startsIn = delta > 0 ? delta : delta + HOURS_PER_WEEK;
      if (!soonest || startsIn < soonest.startsIn) {
        soonest = { event, startsIn };
      }
    }
  }
  if (!soonest) throw new Error('The calendar has no event');
  return soonest;
};
