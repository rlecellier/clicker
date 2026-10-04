import { DAYS_PER_WEEK } from '@game/time';

import type { CalendarEvent, EventMode, Recurrence } from './types';

// What the player can add to their plan.
export const ACTIVITIES = [
  { id: 'read', kind: 'read', title: 'Read a book' },
] as const satisfies {
  id: string;
  kind: CalendarEvent['kind'];
  title: string;
}[];

export type ActivityId = (typeof ACTIVITIES)[number]['id'];

export const REPEATS = [
  { id: 'once', label: 'Does not repeat' },
  { id: 'daily', label: 'Every day' },
  { id: 'weekdays', label: 'Every weekday' },
  { id: 'weekends', label: 'Every weekend' },
] as const;

export type Repeat = (typeof REPEATS)[number]['id'];

const WEEKDAYS = [0, 1, 2, 3, 4];
const WEEKEND = [5, 6];

// How often an event repeats. A single event happens on `day`, as days since
// the start of the game.
export const recurrenceOf = (repeat: Repeat, day: number): Recurrence => {
  switch (repeat) {
    case 'once': {
      return { type: 'once', day };
    }
    case 'daily': {
      return {
        type: 'weekly',
        days: Array.from({ length: DAYS_PER_WEEK }, (_, index) => index),
      };
    }
    case 'weekdays': {
      return { type: 'weekly', days: WEEKDAYS };
    }
    case 'weekends': {
      return { type: 'weekly', days: WEEKEND };
    }
  }
};

export type EventDraft = {
  activity: ActivityId;
  // hours since the start of the day
  start: number;
  end: number;
  repeat: Repeat;
  mode: EventMode;
};

// A draft as the form shows it: the times are "HH:MM" texts.
export type EventDraftText = Omit<EventDraft, 'start' | 'end'> & {
  start: string;
  end: string;
};

// The reason a draft cannot be planned, if any. The game cuts the day at half
// hours, so events start and end on them.
export const problemWith = (draft: EventDraft) => {
  if ((draft.start * 2) % 1 !== 0 || (draft.end * 2) % 1 !== 0) {
    return 'Events start and end on the hour or the half hour.';
  }
  if (draft.end <= draft.start) return 'The event must end after it starts.';
};

export const eventOf = (
  draft: EventDraft,
  day: number,
): Omit<CalendarEvent, 'id'> => {
  const activity = ACTIVITIES.find(({ id }) => id === draft.activity);
  return {
    kind: activity?.kind ?? 'read',
    title: activity?.title ?? 'Read a book',
    mode: draft.mode,
    recurrence: recurrenceOf(draft.repeat, day),
    start: draft.start,
    end: draft.end,
  };
};
