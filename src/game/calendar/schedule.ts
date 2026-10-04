import { DAYS_PER_WEEK, HOURS_PER_DAY } from '@game/time';

import type { CalendarEvent, Schedule } from './types';

// The next occurrence search looks this many days ahead: a weekly event comes
// back within a week.
const SEARCH_DAYS = DAYS_PER_WEEK + 1;

// Whether the event happens on a day of the game (days since the start).
export const occursOn = (event: CalendarEvent, day: number) =>
  event.recurrence.type === 'once'
    ? event.recurrence.day === day
    : event.recurrence.days.includes(day % DAYS_PER_WEEK);

// Identifies one occurrence of an event: the event and its day.
export const occurrenceKey = (event: CalendarEvent, day: number) =>
  `${event.id}@${day}`;

const isDeclined = (schedule: Schedule, event: CalendarEvent, day: number) =>
  schedule.declined.includes(occurrenceKey(event, day));

// The events that happen on a day, the declined ones left out.
export const eventsOnDay = (schedule: Schedule, day: number) =>
  schedule.plan.filter(
    (event) => occursOn(event, day) && !isDeclined(schedule, event, day),
  );

// The event running at a given game hour, if any.
export const eventAt = (schedule: Schedule, hour: number) => {
  const day = Math.floor(hour / HOURS_PER_DAY);
  const hourOfDay = hour % HOURS_PER_DAY;
  return eventsOnDay(schedule, day).find(
    (event) => hourOfDay >= event.start && hourOfDay < event.end,
  );
};

export type Occurrence = {
  event: CalendarEvent;
  // day of the game the occurrence is on
  day: number;
  // game hours left before it starts
  startsIn: number;
};

// The next event to start after a given game hour, if the calendar has one.
export const nextEventAfter = (
  schedule: Schedule,
  hour: number,
): Occurrence | undefined => {
  const today = Math.floor(hour / HOURS_PER_DAY);
  for (let day = today; day < today + SEARCH_DAYS; day += 1) {
    const starting = eventsOnDay(schedule, day)
      .filter((event) => day * HOURS_PER_DAY + event.start > hour)
      .toSorted((a, b) => a.start - b.start)[0];
    if (starting) {
      return {
        event: starting,
        day,
        startsIn: day * HOURS_PER_DAY + starting.start - hour,
      };
    }
  }
  return undefined;
};

// Whether two events can happen on the same day at overlapping hours.
const clash = (a: CalendarEvent, b: CalendarEvent) => {
  if (a.start >= b.end || b.start >= a.end) return false;
  if (a.recurrence.type === 'once') return occursOn(b, a.recurrence.day);
  if (b.recurrence.type === 'once') return occursOn(a, b.recurrence.day);
  const otherDays = b.recurrence.days;
  return a.recurrence.days.some((day) => otherDays.includes(day));
};

// Whether the event fits in the plan: it overlaps none of the planned events.
export const fitsInPlan = (plan: CalendarEvent[], event: CalendarEvent) =>
  plan.every((planned) => !clash(planned, event));

export type AskStart = Occurrence & {
  // game hour the occurrence starts at
  time: number;
};

// The first `ask` event to start in the hours after `from`, up to `to`.
export const nextAskStart = (
  schedule: Schedule,
  from: number,
  to: number,
): AskStart | undefined => {
  for (
    let day = Math.floor(from / HOURS_PER_DAY);
    day <= Math.floor(to / HOURS_PER_DAY);
    day += 1
  ) {
    const asking = eventsOnDay(schedule, day)
      .filter((event) => {
        const time = day * HOURS_PER_DAY + event.start;
        return event.mode === 'ask' && time > from && time <= to;
      })
      .toSorted((a, b) => a.start - b.start)[0];
    if (asking) {
      const time = day * HOURS_PER_DAY + asking.start;
      return { event: asking, day, startsIn: time - from, time };
    }
  }
  return undefined;
};
