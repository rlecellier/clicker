import type { EventKind } from '@game/history';
import type { Location } from '@game/location';

export type ActionId =
  | 'work'
  | 'snack'
  | 'meal'
  | 'read-1'
  | 'read-2'
  | 'read-3'
  | 'sleep-2'
  | 'sleep-4'
  | 'sleep-6'
  | 'sleep-8'
  | 'think-30'
  | 'think-60'
  | 'think-120'
  | 'eat-out'
  | 'shopping';

// What the player can do where they are: the game clock runs for `hours`.
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
  // where the player must be, or `anywhere`
  place: Location | 'anywhere';
  // game hours it takes
  hours: number;
  // calories (in % of the gauge) added over the whole action
  calories?: number;
  // gold coins paid when it starts
  cost?: number;
  // portions taken from the fridge when it starts
  portions?: number;
  // fills the fridge once it is over
  restocks?: boolean;
};
