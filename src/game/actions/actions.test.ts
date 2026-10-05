import { expect, test } from 'vitest';

import { ACTIONS, actionsAt, isActionId } from './actions';

test('at home the player eats, reads and sleeps', () => {
  expect(actionsAt('home').map(({ id }) => id)).toEqual([
    'breakfast',
    'lunch',
    'dinner',
    'read',
    'sleep-2',
    'sleep-4',
    'sleep-6',
    'sleep-8',
  ]);
});

test('at work the player works, half an hour at a time', () => {
  expect(actionsAt('work')).toEqual([ACTIONS.work]);
  expect(ACTIONS.work.hours).toBe(0.5);
});

test('sleeping lasts as long as its name says', () => {
  expect(ACTIONS['sleep-6'].hours).toBe(6);
  expect(ACTIONS['sleep-6'].label).toBe('Sleep 6h');
});

test('every action lasts a whole number of half hours', () => {
  for (const { hours } of Object.values(ACTIONS)) {
    expect(hours * 2).toBe(Math.round(hours * 2));
  }
});

test('recognises the actions of the game', () => {
  expect(isActionId('read')).toBe(true);
  expect(isActionId('fly')).toBe(false);
});
