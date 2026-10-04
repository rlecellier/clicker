import { eventAt, type CalendarEvent } from '@game/calendar';

import type { Activity, Location } from './types';

export const LOCATIONS: readonly Location[] = ['home', 'work', 'restaurant'];

export const isLocation = (value: string | undefined): value is Location =>
  (LOCATIONS as readonly (string | undefined)[]).includes(value);

const LOCATION_BY_EVENT_KIND: Record<CalendarEvent['kind'], Location> = {
  work: 'work',
  meal: 'restaurant',
  sleep: 'home',
};

const ACTIVITY_BY_EVENT_KIND: Record<CalendarEvent['kind'], Activity> = {
  work: 'working',
  meal: 'eating',
  sleep: 'sleeping',
};

// Where the player is at a given hour of the week: the place of the running
// event, at home when nothing is scheduled.
export const locationAt = (weekHour: number): Location => {
  const running = eventAt(weekHour);
  return running ? LOCATION_BY_EVENT_KIND[running.kind] : 'home';
};

// What the player is doing at a given hour of the week: the running event,
// relaxing when nothing is scheduled.
export const activityAt = (weekHour: number): Activity => {
  const running = eventAt(weekHour);
  return running ? ACTIVITY_BY_EVENT_KIND[running.kind] : 'relaxing';
};
