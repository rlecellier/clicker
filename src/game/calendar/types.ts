// 'work' events earn the salary while they run, 'meal' events add their
// calories, 'sleep' events empty the brain gauge, 'read' events move the book.
export type EventKind = 'work' | 'meal' | 'sleep' | 'read';

// 'auto' events start by themselves, 'ask' events ask the player first.
export type EventMode = 'auto' | 'ask';

export type Recurrence =
  // every week, on these days of the week (0 = Monday)
  | { type: 'weekly'; days: number[] }
  // a single day, as days since the start of the game
  | { type: 'once'; day: number };

export type CalendarEvent = {
  id: string;
  kind: EventKind;
  title: string;
  mode: EventMode;
  recurrence: Recurrence;
  // hours since the start of the day, between 0 and 24
  start: number;
  end: number;
  // calories (in % of the gauge) added over the whole meal
  calories?: number;
};

// What the player plans to do: the events of the calendar, and the occurrences
// of an `ask` event that they turned down.
export type Schedule = {
  plan: CalendarEvent[];
  // keys of the declined occurrences, see `occurrenceKey`
  declined: string[];
};
