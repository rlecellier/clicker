// What a done action is about: 'work' earns coins, 'meal' fills the calories,
// 'sleep' empties the brain gauge, 'read' moves the book, 'search' is the time
// spent looking for a job, 'think' lets the time go by, 'shopping' fills the
// fridge.
export type EventKind =
  'work' | 'meal' | 'sleep' | 'read' | 'search' | 'think' | 'shopping';

// What the player did, in game hours since the start of the game. Actions
// done one right after the other are merged into a single entry.
export type DoneEntry = {
  kind: EventKind;
  title: string;
  start: number;
  end: number;
};

// A done entry on one day of the calendar, in hours since the start of that day.
export type DayEntry = {
  id: string;
  kind: EventKind;
  title: string;
  start: number;
  end: number;
};
