import { expect, test } from 'vitest';

import {
  ACTION_CATEGORIES,
  ACTIONS,
  actionsAt,
  isActionId,
  isDoableAt,
} from './actions';

test('at home the player eats, reads, sleeps, thinks and goes shopping', () => {
  expect(actionsAt('home').map(({ id }) => id)).toEqual([
    'snack',
    'meal',
    'read-1',
    'read-2',
    'read-3',
    'sleep-2',
    'sleep-4',
    'sleep-6',
    'sleep-8',
    'think-30',
    'think-60',
    'think-120',
    'shopping',
  ]);
});

test('at work the player works, half an hour at a time, eats out and thinks', () => {
  expect(actionsAt('work').map(({ id }) => id)).toEqual([
    'work',
    'eat-out',
    'think-30',
    'think-60',
    'think-120',
  ]);
  expect(ACTIONS.work.hours).toBe(0.5);
});

test('thinking lasts 30 min, 1 hour or 2 hours', () => {
  expect(ACTIONS['think-30'].hours).toBe(0.5);
  expect(ACTIONS['think-60'].hours).toBe(1);
  expect(ACTIONS['think-120'].hours).toBe(2);
  expect(ACTIONS['think-120'].label).toBe('Think 2h');
});

test('a meal at home takes a portion of the fridge, a meal out costs coins', () => {
  expect(ACTIONS.meal.portions).toBe(1);
  expect(ACTIONS.meal.cost).toBeUndefined();
  expect(ACTIONS['eat-out'].cost).toBeGreaterThan(0);
  expect(ACTIONS['eat-out'].portions).toBeUndefined();
});

test('reading lasts 1, 2 or 3 hours', () => {
  expect(ACTIONS['read-3'].hours).toBe(3);
  expect(ACTIONS['read-3'].label).toBe('Read 3h');
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
  expect(isActionId('read-2')).toBe(true);
  expect(isActionId('fly')).toBe(false);
});

test('thinking comes from the player and follows them everywhere', () => {
  expect(ACTIONS['think-60'].category).toBe('self');
  expect(isDoableAt(ACTIONS['think-60'], 'home')).toBe(true);
  expect(isDoableAt(ACTIONS['think-60'], 'work')).toBe(true);
});

test('the actions of a place stay at that place', () => {
  expect(ACTIONS.work.category).toBe('place');
  expect(isDoableAt(ACTIONS.work, 'work')).toBe(true);
  expect(isDoableAt(ACTIONS.work, 'home')).toBe(false);
});

test('the categories are shown place first, then the player, then the phone', () => {
  expect(ACTION_CATEGORIES).toEqual(['place', 'self', 'online']);
});
