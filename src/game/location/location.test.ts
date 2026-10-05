import { expect, test } from 'vitest';

import { isLocation } from './location';

test('recognises the places of the game', () => {
  expect(isLocation('home')).toBe(true);
  expect(isLocation('work')).toBe(true);
  expect(isLocation('restaurant')).toBe(false);
  expect(isLocation(undefined)).toBe(false);
});
