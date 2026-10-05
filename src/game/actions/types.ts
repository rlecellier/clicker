import type { EventKind } from '@game/history';
import type { Location } from '@game/location';

export type ActionId =
  | 'work'
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'read-1'
  | 'read-2'
  | 'read-3'
  | 'sleep-2'
  | 'sleep-4'
  | 'sleep-6'
  | 'sleep-8';

// What the player can do where they are: it moves the game clock by `hours`.
export type Action = {
  id: ActionId;
  // the button
  label: string;
  // actions of one group share a row: the group's name, and the short name
  // of this one in it
  group?: { name: string; option: string };
  // what it is called in the calendar
  title: string;
  kind: EventKind;
  // where the player must be
  place: Location;
  // game hours it takes
  hours: number;
  // calories (in % of the gauge) added over the whole action
  calories?: number;
};
