import { expect, test } from 'vitest';

import { eventAt, nextEventAfter } from './schedule';

test('eventAt finds the event running at that hour', () => {
  expect(eventAt(9)?.id).toBe('work-morning');
  expect(eventAt(7)?.id).toBe('breakfast');
});

test('eventAt finds nothing between two events', () => {
  expect(eventAt(18.5)).toBeUndefined();
});

test('eventAt finds no work on the weekend', () => {
  expect(eventAt(5 * 24 + 9)).toBeUndefined();
});

test('nextEventAfter finds the following event and the wait', () => {
  const { event, startsIn } = nextEventAfter(9);
  expect(event.id).toBe('lunch');
  expect(startsIn).toBe(3);
});

test('nextEventAfter skips the running event', () => {
  expect(nextEventAfter(7).event.id).toBe('work-morning');
});

test('nextEventAfter goes over midnight to the next day', () => {
  const { event, startsIn } = nextEventAfter(23.5);
  expect(event.id).toBe('sleep-night');
  expect(startsIn).toBe(0.5);
});

test('nextEventAfter wraps around the end of the week', () => {
  const { event, startsIn } = nextEventAfter(7 * 24 - 0.5);
  expect(event.id).toBe('sleep-night');
  expect(startsIn).toBe(0.5);
});
