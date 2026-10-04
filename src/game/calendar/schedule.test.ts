import { expect, test } from 'vitest';

import { EVENING_READING, WORKING_SCHEDULE } from '@test/schedules';

import {
  eventAt,
  eventsOnDay,
  fitsInPlan,
  nextAskStart,
  nextEventAfter,
  occurrenceKey,
  occursOn,
} from './schedule';
import type { CalendarEvent, Schedule } from './types';

const SCHEDULE = WORKING_SCHEDULE;

const once = (patch: Partial<CalendarEvent>): CalendarEvent => ({
  ...EVENING_READING,
  id: 'once',
  recurrence: { type: 'once', day: 2 },
  ...patch,
});

test('eventAt finds the event running at that hour', () => {
  expect(eventAt(SCHEDULE, 9)?.id).toBe('work-morning');
  expect(eventAt(SCHEDULE, 7)?.id).toBe('breakfast');
});

test('eventAt finds nothing between two events', () => {
  expect(eventAt(SCHEDULE, 18.5)).toBeUndefined();
});

test('eventAt finds no work on the weekend', () => {
  expect(eventAt(SCHEDULE, 5 * 24 + 9)).toBeUndefined();
});

test('eventAt looks at the day of the game, weeks after weeks', () => {
  expect(eventAt(SCHEDULE, 14 * 24 + 9)?.id).toBe('work-morning');
  expect(eventAt(SCHEDULE, 12 * 24 + 9)).toBeUndefined();
});

test('a once event happens on its day only', () => {
  const event = once({});
  expect(occursOn(event, 2)).toBe(true);
  expect(occursOn(event, 9)).toBe(false);
});

test('a declined occurrence does not run, the others do', () => {
  const schedule: Schedule = {
    ...SCHEDULE,
    declined: [occurrenceKey(SCHEDULE.plan[2] ?? EVENING_READING, 0)],
  };
  expect(eventsOnDay(SCHEDULE, 0).map((event) => event.id)).toContain('lunch');
  expect(eventsOnDay(schedule, 0).map((event) => event.id)).not.toContain(
    'lunch',
  );
  expect(eventsOnDay(schedule, 1).map((event) => event.id)).toContain('lunch');
});

test('nextEventAfter finds the following event and the wait', () => {
  const next = nextEventAfter(SCHEDULE, 9);
  expect(next?.event.id).toBe('lunch');
  expect(next?.startsIn).toBe(3);
});

test('nextEventAfter skips the running event', () => {
  expect(nextEventAfter(SCHEDULE, 7)?.event.id).toBe('work-morning');
});

test('nextEventAfter goes over midnight to the next day', () => {
  const next = nextEventAfter(SCHEDULE, 23.5);
  expect(next?.event.id).toBe('sleep-night');
  expect(next?.startsIn).toBe(0.5);
});

test('nextEventAfter wraps around the end of the week', () => {
  const next = nextEventAfter(SCHEDULE, 7 * 24 - 0.5);
  expect(next?.event.id).toBe('sleep-night');
  expect(next?.startsIn).toBe(0.5);
});

test('nextEventAfter finds nothing in an empty calendar', () => {
  expect(nextEventAfter({ plan: [], declined: [] }, 5)).toBeUndefined();
});

test('nextEventAfter sees a once event on a later day', () => {
  const schedule: Schedule = {
    plan: [once({ start: 10, end: 11 })],
    declined: [],
  };
  expect(nextEventAfter(schedule, 5)?.startsIn).toBe(2 * 24 + 5);
  expect(nextEventAfter(schedule, 3 * 24)).toBeUndefined();
});

test('an event fits when it overlaps no planned event', () => {
  // 20:00 to 23:00 is free every day
  expect(fitsInPlan(SCHEDULE.plan, EVENING_READING)).toBe(true);
  expect(fitsInPlan(SCHEDULE.plan, { ...EVENING_READING, start: 19.5 })).toBe(
    false,
  );
  // work on weekdays only: free on Saturday morning
  expect(
    fitsInPlan(SCHEDULE.plan, {
      ...EVENING_READING,
      start: 9,
      end: 10,
      recurrence: { type: 'once', day: 5 },
    }),
  ).toBe(true);
  expect(
    fitsInPlan(SCHEDULE.plan, {
      ...EVENING_READING,
      start: 9,
      end: 10,
      recurrence: { type: 'once', day: 7 },
    }),
  ).toBe(false);
});

test('finds the first ask event to start in an interval', () => {
  const ask = once({ mode: 'ask', start: 10, end: 11 });
  const schedule: Schedule = { plan: [ask], declined: [] };
  const found = nextAskStart(schedule, 0, 3 * 24);
  expect(found).toMatchObject({ day: 2, time: 2 * 24 + 10 });
  // it starts at the end of the interval, not before its start
  expect(nextAskStart(schedule, 2 * 24 + 9, 2 * 24 + 10)?.time).toBe(58);
  expect(nextAskStart(schedule, 2 * 24 + 10, 3 * 24)).toBeUndefined();
  // an auto event never asks
  expect(
    nextAskStart({ plan: [{ ...ask, mode: 'auto' }], declined: [] }, 0, 100),
  ).toBeUndefined();
  // a declined occurrence does not ask again
  expect(
    nextAskStart({ plan: [ask], declined: [occurrenceKey(ask, 2)] }, 0, 100),
  ).toBeUndefined();
});
