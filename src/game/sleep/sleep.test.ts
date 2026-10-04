import { expect, test } from 'vitest';

import { HOURS_PER_DAY } from '@game/time';

import { BRAIN_CAP, INITIAL_BRAIN } from './constants';
import { INITIAL_SLEEP, isSleeping, stepSleep } from './sleep';

const at = (day: number, hour: number) => day * HOURS_PER_DAY + hour;

test('sleeps from 23:00 to 7:00, every day', () => {
  expect(isSleeping(at(2, 22.9))).toBe(false);
  expect(isSleeping(at(2, 23))).toBe(true);
  expect(isSleeping(at(3, 0))).toBe(true);
  expect(isSleeping(at(3, 6.9))).toBe(true);
  expect(isSleeping(at(3, 7))).toBe(false);
});

test('the game starts one hour into the night', () => {
  expect(INITIAL_SLEEP.brain).toBe(INITIAL_BRAIN);
  expect(stepSleep(INITIAL_SLEEP, at(0, 0), at(0, 7)).brain).toBeCloseTo(0, 5);
});

test('the brain fills completely over the 16 hours awake', () => {
  const awake = stepSleep({ brain: 0 }, at(0, 7), at(0, 23));
  expect(awake.brain).toBeCloseTo(BRAIN_CAP, 5);
  expect(stepSleep({ brain: 0 }, at(0, 7), at(0, 15)).brain).toBeCloseTo(50, 5);
});

test('the brain empties completely over the 8 hours of sleep', () => {
  const asleep = stepSleep({ brain: BRAIN_CAP }, at(0, 23), at(1, 7));
  expect(asleep.brain).toBeCloseTo(0, 5);
  expect(
    stepSleep({ brain: BRAIN_CAP }, at(0, 23), at(1, 3)).brain,
  ).toBeCloseTo(50, 5);
});

test('the brain stays between 0 and 100', () => {
  expect(stepSleep({ brain: 10 }, at(0, 23), at(1, 7)).brain).toBe(0);
  expect(stepSleep({ brain: 90 }, at(0, 15), at(0, 23)).brain).toBe(BRAIN_CAP);
});

test('a long frame gives the same result as many short ones', () => {
  const long = stepSleep(INITIAL_SLEEP, at(0, 0), at(5, 0));
  let short = INITIAL_SLEEP;
  for (let step = 0; step < 5 * 96; step += 1) {
    short = stepSleep(short, step / 4, (step + 1) / 4);
  }
  expect(long.brain).toBeCloseTo(short.brain, 5);
  expect(long.brain).toBeCloseTo(INITIAL_BRAIN, 5);
});
