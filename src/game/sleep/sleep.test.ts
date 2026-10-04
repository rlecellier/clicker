import { expect, test } from 'vitest';

import { BRAIN_READING_FILL_PER_HOUR } from '@game/reading';
import { HOURS_PER_DAY } from '@game/time';
import { READING_SCHEDULE, WORKING_SCHEDULE } from '@test/schedules';

import {
  AWAKE_HOURS_PER_DAY,
  BRAIN_CAP,
  BRAIN_IDLE_FILL_PER_DAY,
  BRAIN_SLEEP_DRAIN,
  DREAM_CAP,
  INITIAL_BRAIN,
} from './constants';
import { INITIAL_SLEEP, isSleeping, stepSleep } from './sleep';
const SCHEDULE = WORKING_SCHEDULE;

const at = (day: number, hour: number) => day * HOURS_PER_DAY + hour;

const MORNING = { brain: 0, dreamGauge: 0, dreams: 0, ...SCHEDULE };
const START = { ...INITIAL_SLEEP, ...SCHEDULE };

test('sleeps from 23:00 to 7:00, every day', () => {
  expect(isSleeping(SCHEDULE, at(2, 22.9))).toBe(false);
  expect(isSleeping(SCHEDULE, at(2, 23))).toBe(true);
  expect(isSleeping(SCHEDULE, at(3, 0))).toBe(true);
  expect(isSleeping(SCHEDULE, at(3, 6.9))).toBe(true);
  expect(isSleeping(SCHEDULE, at(3, 7))).toBe(false);
});

test('the first night empties the starting brain without making a dream', () => {
  const morning = stepSleep(START, at(0, 0), at(0, 7));
  expect(INITIAL_SLEEP.brain).toBe(INITIAL_BRAIN);
  expect(morning.brain).toBeCloseTo(0, 5);
  expect(morning.dreamGauge).toBeCloseTo(0, 5);
  expect(morning.dreams).toBe(0);
});

test('idle hours fill 10% a day, activities fill the brain faster', () => {
  // 18:00 to 19:00 is a free hour
  const idle = stepSleep(MORNING, at(0, 18), at(0, 19)).brain;
  const work = stepSleep(MORNING, at(0, 8), at(0, 9)).brain;
  const meal = stepSleep(MORNING, at(0, 12), at(0, 13)).brain;
  expect(idle * AWAKE_HOURS_PER_DAY).toBeCloseTo(BRAIN_IDLE_FILL_PER_DAY, 5);
  expect(work).toBeGreaterThan(idle);
  expect(meal).toBeGreaterThan(idle);
});

test('a working weekday ends around 30%', () => {
  const evening = stepSleep(MORNING, at(0, 7), at(0, 23));
  expect(evening.brain).toBeGreaterThan(28);
  expect(evening.brain).toBeLessThan(36);
});

test('the brain never goes over its cap', () => {
  expect(stepSleep({ ...MORNING, brain: 99 }, at(0, 8), at(0, 12)).brain).toBe(
    BRAIN_CAP,
  );
});

test('a night empties 80% of the brain, the rest goes to the dream gauge', () => {
  const evening = stepSleep(MORNING, at(0, 7), at(0, 23));
  const morning = stepSleep({ ...MORNING, ...evening }, at(0, 23), at(1, 7));
  expect(morning.brain).toBe(0);
  expect(morning.dreamGauge).toBeCloseTo(BRAIN_SLEEP_DRAIN - evening.brain, 5);
  expect(morning.dreams).toBe(0);
});

test('the sleep empties the brain at an even pace', () => {
  const half = stepSleep({ ...MORNING, brain: 100 }, at(0, 23), at(1, 3));
  expect(half.brain).toBeCloseTo(60, 5);
  expect(half.dreamGauge).toBe(0);
});

test('a full dream gauge makes a dream and starts over', () => {
  const asleep = stepSleep(
    { ...SCHEDULE, brain: 0, dreamGauge: DREAM_CAP - 5, dreams: 2 },
    at(0, 23),
    at(1, 0),
  );
  // one hour of sleep drains 10, none of it from an empty brain
  expect(asleep.dreams).toBe(3);
  expect(asleep.dreamGauge).toBeCloseTo(5, 5);
});

test('keeps the dreams made over several nights', () => {
  const week = stepSleep(MORNING, at(0, 7), at(7, 7));
  expect(week.dreams).toBeGreaterThanOrEqual(3);
  expect(week.dreamGauge).toBeLessThan(DREAM_CAP);
});

test('one long run gives the same as many short ones', () => {
  const long = stepSleep(START, at(0, 0), at(5, 0));
  let short = START;
  for (let step = 0; step < 5 * 96; step += 1) {
    short = { ...short, ...stepSleep(short, step / 4, (step + 1) / 4) };
  }
  expect(long.brain).toBeCloseTo(short.brain, 5);
  expect(long.dreams + long.dreamGauge / DREAM_CAP).toBeCloseTo(
    short.dreams + short.dreamGauge / DREAM_CAP,
    5,
  );
});

test('reading fills the brain faster, during a reading event only', () => {
  const reader = { ...MORNING, ...READING_SCHEDULE };
  // 20:00 to 21:00 is a reading event
  const idle = stepSleep(reader, at(0, 20), at(0, 21)).brain;
  const read = stepSleep(reader, at(0, 20), at(0, 21), 1).brain;
  expect(read - idle).toBeCloseTo(BRAIN_READING_FILL_PER_HOUR, 5);
  // 8:00 to 9:00 is work: no reading event to read in
  const work = stepSleep(reader, at(0, 8), at(0, 9)).brain;
  expect(stepSleep(reader, at(0, 8), at(0, 9), 1).brain).toBe(work);
});
