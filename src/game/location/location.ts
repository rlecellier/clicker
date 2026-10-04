import { EVENTS, type CalendarEvent } from '@game/calendar';
import { HOURS_PER_DAY } from '@game/time';

import type { Location } from './types';

const LOCATION_BY_EVENT_KIND: Record<CalendarEvent['kind'], Location> = {
  work: 'office',
  meal: 'restaurant',
  sleep: 'home',
};

// Where the player is at a given hour of the week: the place of the running
// event, at home when nothing is scheduled.
export const locationAt = (weekHour: number): Location => {
  const day = Math.floor(weekHour / HOURS_PER_DAY);
  const hour = weekHour % HOURS_PER_DAY;
  const running = EVENTS.find(
    (event) =>
      event.days.includes(day) && hour >= event.start && hour < event.end,
  );
  return running ? LOCATION_BY_EVENT_KIND[running.kind] : 'home';
};
