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

export const ACTIONS: Record<ActionId, Action> = {
  work: {
    id: 'work',
    label: 'Work',
    title: 'Work',
    kind: 'work',
    place: 'work',
    hours: 0.5,
  },
  breakfast: {
    id: 'breakfast',
    group: { name: 'Eat', option: 'Breakfast' },
    label: 'Have breakfast',
    title: 'Breakfast',
    kind: 'meal',
    place: 'home',
    hours: 0.5,
    calories: 15,
  },
  lunch: {
    id: 'lunch',
    group: { name: 'Eat', option: 'Lunch' },
    label: 'Have lunch',
    title: 'Lunch',
    kind: 'meal',
    place: 'home',
    hours: 1,
    calories: 21,
  },
  dinner: {
    id: 'dinner',
    group: { name: 'Eat', option: 'Dinner' },
    label: 'Have dinner',
    title: 'Dinner',
    kind: 'meal',
    place: 'home',
    hours: 1,
    calories: 21,
  },
  'read-1': read(1),
  'read-2': read(2),
  'read-3': read(3),
  'sleep-2': sleep(2),
  'sleep-4': sleep(4),
  'sleep-6': sleep(6),
  'sleep-8': sleep(8),
};

// The time spent looking for a job, which ends with the player hired.
export const JOB_SEARCH = {
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
    (action) => action.place === place,
  );
