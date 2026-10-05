import { expect, test } from 'vitest';

import { defaultDestination, destinationsFrom, isLocation } from './location';

test('recognises the places of the game', () => {
  expect(isLocation('home')).toBe(true);
  expect(isLocation('work')).toBe(true);
  expect(isLocation('restaurant')).toBe(false);
  expect(isLocation(undefined)).toBe(false);
});

test('only the job takes the player to work', () => {
  expect(destinationsFrom('home', false)).toEqual([]);
  expect(destinationsFrom('home', true)).toEqual(['work']);
  expect(destinationsFrom('work', false)).toEqual(['home']);
});

test('the usual destination is the other place', () => {
  expect(defaultDestination('work', true)).toBe('home');
  expect(defaultDestination('home', true)).toBe('work');
  expect(defaultDestination('home', false)).toBeUndefined();
});
