import { expect, test } from 'vitest';

import { activityAt, isLocation, locationAt } from './location';

test('is at work during work hours', () => {
  expect(locationAt(9)).toBe('work');
});

test('is at the restaurant during a meal', () => {
  expect(locationAt(12.5)).toBe('restaurant');
});

test('is at home when nothing is scheduled or asleep', () => {
  expect(locationAt(3)).toBe('home');
  expect(locationAt(18.5)).toBe('home');
});

test('is at home on the weekend during work hours', () => {
  expect(locationAt(5 * 24 + 9)).toBe('home');
});

test('is doing what the running event says', () => {
  expect(activityAt(3)).toBe('sleeping');
  expect(activityAt(9)).toBe('working');
  expect(activityAt(12.5)).toBe('eating');
  expect(activityAt(18.5)).toBe('relaxing');
});

test('recognises the places of the game', () => {
  expect(isLocation('work')).toBe(true);
  expect(isLocation('office')).toBe(false);
  expect(isLocation(undefined)).toBe(false);
});
