import type { Location } from '@game/location';

import type { Action, ActionId } from './types';

const sleep = (hours: number): Action => ({
  id: `sleep-${hours}` as ActionId,
  label: `Sleep ${hours}h`,
  group: { name: 'Sleep', option: `${hours}h` },
  title: 'Sleep',
  kind: 'sleep',
  place: 'home',
  hours,
});

const read = (hours: number): Action => ({
  id: `read-${hours}` as ActionId,
  label: `Read ${hours}h`,
  group: { name: 'Read', option: `${hours}h` },
  title: 'Read',
  kind: 'read',
  place: 'home',
  hours,
});

const think = (minutes: number, option: string): Action => ({
  id: `think-${minutes}` as ActionId,
  label: `Think ${option}`,
  group: { name: 'Think', option },
  title: 'Think',
  kind: 'think',
  place: 'anywhere',
  hours: minutes / 60,
});

// A meal at home comes out of the fridge.
const homeMeal = (
  action: Omit<Action, 'kind' | 'place' | 'portions'>,
): Action => ({ ...action, kind: 'meal', place: 'home', portions: 1 });

export const ACTIONS: Record<ActionId, Action> = {
  work: {
    id: 'work',
    label: 'Work',
    title: 'Work',
    kind: 'work',
    place: 'work',
    hours: 0.5,
  },
  breakfast: homeMeal({
    id: 'breakfast',
    group: { name: 'Eat', option: 'Breakfast' },
    label: 'Have breakfast',
    title: 'Breakfast',
    hours: 0.5,
    calories: 15,
  }),
  lunch: homeMeal({
    id: 'lunch',
    group: { name: 'Eat', option: 'Lunch' },
    label: 'Have lunch',
    title: 'Lunch',
    hours: 1,
    calories: 21,
  }),
  dinner: homeMeal({
    id: 'dinner',
    group: { name: 'Eat', option: 'Dinner' },
    label: 'Have dinner',
    title: 'Dinner',
    hours: 1,
    calories: 21,
  }),
  'eat-out': {
    id: 'eat-out',
    label: 'Eat out',
    title: 'Lunch out',
    kind: 'meal',
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

// The actions the player can do at a place, in the order they are offered.
export const actionsAt = (place: Location): Action[] =>
  ACTION_IDS.map((id) => ACTIONS[id]).filter(
    (action) => action.place === place || action.place === 'anywhere',
  );
