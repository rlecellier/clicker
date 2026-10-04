import { eventAt, type EventKind, type Schedule } from '@game/calendar';

import type { Activity, Location } from './types';

export const LOCATIONS: readonly Location[] = ['home', 'work', 'restaurant'];

export const isLocation = (value: string | undefined): value is Location =>
  (LOCATIONS as readonly (string | undefined)[]).includes(value);

const LOCATION_BY_EVENT_KIND: Record<EventKind, Location> = {
  work: 'work',
  meal: 'restaurant',
  sleep: 'home',
  read: 'home',
};

const ACTIVITY_BY_EVENT_KIND: Record<EventKind, Activity> = {
  work: 'working',
  meal: 'eating',
  sleep: 'sleeping',
  read: 'reading',
};

// Where the player is at a given game hour: the place of the running
// event, at home when nothing is scheduled.
export const locationAt = (schedule: Schedule, hour: number): Location => {
  const running = eventAt(schedule, hour);
  return running ? LOCATION_BY_EVENT_KIND[running.kind] : 'home';
};

// What the player is doing at a given game hour: the running event,
// relaxing when nothing is scheduled.
export const activityAt = (schedule: Schedule, hour: number): Activity => {
  const running = eventAt(schedule, hour);
  return running ? ACTIVITY_BY_EVENT_KIND[running.kind] : 'relaxing';
};
