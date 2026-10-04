import { expect, test } from 'vitest';

import { READING_SCHEDULE } from '@test/schedules';

import { activityAt, isLocation, locationAt } from './location';

const SCHEDULE = READING_SCHEDULE;

test('is at work during work hours', () => {
  expect(locationAt(SCHEDULE, 9)).toBe('work');
});

test('is at the restaurant during a meal', () => {
  expect(locationAt(SCHEDULE, 12.5)).toBe('restaurant');
});

test('is at home when nothing is scheduled, asleep or reading', () => {
  expect(locationAt(SCHEDULE, 21)).toBe('home');
  expect(locationAt(SCHEDULE, 3)).toBe('home');
  expect(locationAt(SCHEDULE, 18.5)).toBe('home');
});

test('is at home on the weekend during work hours', () => {
  expect(locationAt(SCHEDULE, 5 * 24 + 9)).toBe('home');
});

test('is doing what the running event says', () => {
  expect(activityAt(SCHEDULE, 3)).toBe('sleeping');
  expect(activityAt(SCHEDULE, 9)).toBe('working');
  expect(activityAt(SCHEDULE, 12.5)).toBe('eating');
  expect(activityAt(SCHEDULE, 18.5)).toBe('relaxing');
  expect(activityAt(SCHEDULE, 21)).toBe('reading');
});

test('recognises the places of the game', () => {
  expect(isLocation('work')).toBe(true);
  expect(isLocation('office')).toBe(false);
  expect(isLocation(undefined)).toBe(false);
});
