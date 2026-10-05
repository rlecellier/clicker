import { expect, test } from 'vitest';

import { BRAIN_READING_FILL_PER_HOUR } from '@game/reading';

import {
  AWAKE_HOURS_PER_DAY,
  BRAIN_CAP,
  BRAIN_IDLE_FILL_PER_DAY,
  BRAIN_SLEEP_DRAIN,
  DREAM_CAP,
} from './constants';
import { INITIAL_SLEEP, stepSleep } from './sleep';

const MORNING = { brain: 0, dreamGauge: 0, dreams: 0 };

test('idle hours fill 10% a day, activities fill the brain faster', () => {
  const idle = stepSleep(MORNING, { kind: 'read', hours: 1 }).brain;
  const work = stepSleep(MORNING, { kind: 'work', hours: 1 }).brain;
  const meal = stepSleep(MORNING, { kind: 'meal', hours: 1 }).brain;
  expect(idle * AWAKE_HOURS_PER_DAY).toBeCloseTo(BRAIN_IDLE_FILL_PER_DAY, 5);
  expect(work).toBeGreaterThan(idle);
  expect(meal).toBeGreaterThan(idle);
});

test('the brain never goes over its cap', () => {
  expect(
    stepSleep({ ...MORNING, brain: 99 }, { kind: 'work', hours: 4 }).brain,
  ).toBe(BRAIN_CAP);
});

test('a night empties 80% of the brain, the rest goes to the dream gauge', () => {
  const evening = { ...MORNING, brain: 30 };
  const morning = stepSleep(evening, { kind: 'sleep', hours: 8 });
  expect(morning.brain).toBe(0);
  expect(morning.dreamGauge).toBeCloseTo(BRAIN_SLEEP_DRAIN - 30, 5);
  expect(morning.dreams).toBe(0);
});

test('the sleep empties the brain at an even pace', () => {
  const half = stepSleep(
    { ...MORNING, brain: 100 },
    { kind: 'sleep', hours: 4 },
  );
  expect(half.brain).toBeCloseTo(60, 5);
  expect(half.dreamGauge).toBe(0);
});

test('a full dream gauge makes a dream and starts over', () => {
  const asleep = stepSleep(
    { brain: 0, dreamGauge: DREAM_CAP - 5, dreams: 2 },
    { kind: 'sleep', hours: 1 },
  );
  // one hour of sleep drains 10, none of it from an empty brain
  expect(asleep.dreams).toBe(3);
  expect(asleep.dreamGauge).toBeCloseTo(5, 5);
});

test('sleeping in two goes gives the same as sleeping at once', () => {
  const long = stepSleep(INITIAL_SLEEP, { kind: 'sleep', hours: 8 });
  const first = stepSleep(INITIAL_SLEEP, { kind: 'sleep', hours: 4 });
  const short = stepSleep(first, { kind: 'sleep', hours: 4 });
  expect(long.brain).toBeCloseTo(short.brain, 5);
  expect(long.dreamGauge).toBeCloseTo(short.dreamGauge, 5);
});

test('reading fills the brain faster than idling', () => {
  const idle = stepSleep(MORNING, { kind: 'read', hours: 1 }).brain;
  const read = stepSleep(MORNING, { kind: 'read', hours: 1 }, 1).brain;
  expect(read - idle).toBeCloseTo(BRAIN_READING_FILL_PER_HOUR, 5);
});
