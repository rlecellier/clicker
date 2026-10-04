import { expect, test } from 'vitest';

import { eventOf, problemWith, recurrenceOf, type EventDraft } from './draft';

const DRAFT: EventDraft = {
  activity: 'read',
  start: 20,
  end: 22.5,
  repeat: 'daily',
  mode: 'ask',
};

test('repeats every day, on weekdays, on weekends or not at all', () => {
  expect(recurrenceOf('daily', 3)).toEqual({
    type: 'weekly',
    days: [0, 1, 2, 3, 4, 5, 6],
  });
  expect(recurrenceOf('weekdays', 3)).toEqual({
    type: 'weekly',
    days: [0, 1, 2, 3, 4],
  });
  expect(recurrenceOf('weekends', 3)).toEqual({ type: 'weekly', days: [5, 6] });
  expect(recurrenceOf('once', 3)).toEqual({ type: 'once', day: 3 });
});

test('turns a draft into an event of the calendar', () => {
  expect(eventOf(DRAFT, 3)).toEqual({
    kind: 'read',
    title: 'Read a book',
    mode: 'ask',
    recurrence: recurrenceOf('daily', 3),
    start: 20,
    end: 22.5,
  });
});

test('a draft needs to end after it starts, on a half hour', () => {
  expect(problemWith(DRAFT)).toBeUndefined();
  expect(problemWith({ ...DRAFT, end: 20 })).toMatch(/end after/);
  expect(problemWith({ ...DRAFT, end: 19 })).toMatch(/end after/);
  expect(problemWith({ ...DRAFT, start: 20.25 })).toMatch(/half hour/);
});
