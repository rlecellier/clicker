import type { Location } from '@game/location';

import type { Action, ActionBase, ActionCategory, ActionId } from './types';

const sleep = (hours: number): Action => ({
  id: `sleep-${hours}` as ActionId,
  label: `Sleep ${hours}h`,
  group: { name: 'Sleep', option: `${hours}h` },
  title: 'Sleep',
  kind: 'sleep',
  category: 'place',
  place: 'home',
  hours,
});

const read = (hours: number): Action => ({
  id: `read-${hours}` as ActionId,
  label: `Read ${hours}h`,
  group: { name: 'Read', option: `${hours}h` },
  title: 'Read',
  kind: 'read',
  category: 'place',
  place: 'home',
  hours,
});

const think = (minutes: number, option: string): Action => ({
  id: `think-${minutes}` as ActionId,
  label: `Think ${option}`,
  group: { name: 'Think', option },
  title: 'Think',
  kind: 'think',
  category: 'self',
  hours: minutes / 60,
});

// A meal at home comes out of the fridge.
const homeMeal = (action: Omit<ActionBase, 'kind' | 'portions'>): Action => ({
  ...action,
  kind: 'meal',
  category: 'place',
  place: 'home',
  portions: 1,
});

export const ACTIONS: Record<ActionId, Action> = {
  work: {
    id: 'work',
    label: 'Work',
    title: 'Work',
    kind: 'work',
    category: 'place',
    place: 'work',
    hours: 0.5,
  },
  snack: homeMeal({
    id: 'snack',
    group: { name: 'Eat', option: 'Snack' },
    label: 'Have a snack',
    title: 'Snack',
    hours: 0.5,
    calories: 15,
  }),
  meal: homeMeal({
    id: 'meal',
    group: { name: 'Eat', option: 'Meal' },
    label: 'Have a meal',
    title: 'Meal',
    hours: 1,
    calories: 21,
  }),
  'eat-out': {
    id: 'eat-out',
    label: 'Eat out',
    title: 'Lunch out',
    kind: 'meal',
    category: 'place',
    place: 'work',
    hours: 1,
    calories: 21,
    cost: 8,
  },
  'read-1': read(1),
  'read-2': read(2),
  'read-3': read(3),
  'sleep-2': sleep(2),
  'sleep-4': sleep(4),
  'sleep-6': sleep(6),
  'sleep-8': sleep(8),
  'think-30': think(30, '30 min'),
  'think-60': think(60, '1h'),
  'think-120': think(120, '2h'),
  shopping: {
    id: 'shopping',
    label: 'Go shopping',
    title: 'Shopping',
    kind: 'shopping',
    category: 'place',
    place: 'home',
    hours: 1,
    restocks: true,
  },
};

// The time spent looking for a job, which ends with the player hired.
export const JOB_SEARCH = {
  id: 'job-search',
  title: 'Job hunt',
  kind: 'search',
  hours: 1,
} as const;

export const ACTION_IDS = Object.keys(ACTIONS) as ActionId[];

export const isActionId = (value: unknown): value is ActionId =>
  typeof value === 'string' && Object.hasOwn(ACTIONS, value);

// Whether the player can do an action where they are: the actions of the
// player and of their phone follow them, the others stay at their place.
export const isDoableAt = (action: Action, location: Location): boolean =>
  action.category !== 'place' || action.place === location;

// The actions the player can do at a place, in the order they are offered.
export const actionsAt = (place: Location): Action[] =>
  ACTION_IDS.map((id) => ACTIONS[id]).filter((action) =>
    isDoableAt(action, place),
  );

// The option of a group offered first at that hour of the day: a snack for
// breakfast, a meal for lunch and dinner, a full night of sleep. None for a
// group with no preference.
export const defaultActionOf = (
  group: string,
  hourOfDay: number,
): ActionId | undefined => {
  if (group === 'Sleep') return 'sleep-8';
  if (group === 'Eat') return hourOfDay < 12 ? 'snack' : 'meal';
  return undefined;
};

// The categories, in the order they are shown.
export const ACTION_CATEGORIES: readonly ActionCategory[] = [
  'place',
  'self',
  'online',
];
