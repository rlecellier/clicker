import { eventAt, type Schedule } from '@game/calendar';

import {
  CAKE_CALORIES,
  CAKE_DURATION_HOURS,
  CALORIES_CAP,
  CALORIES_GOOD_MAX,
  CALORIES_GOOD_MIN,
  CALORIES_MAX_TARGET,
  CALORIES_MIN_TARGET,
  FAT_CONVERSION_RATE,
  IDLE_BURN,
  INITIAL_CALORIES,
  SNACK_CALORIES,
  STEP_HOURS,
  WORK_BURN,
} from './constants';
import type { CaloriesLevel, CaloriesStatus, Nutrition } from './types';

export const INITIAL_NUTRITION: Nutrition = {
  calories: INITIAL_CALORIES,
  fat: 0,
  cakeUntil: 0,
};

// Calories per game hour given by the meal running at this game hour.
const mealIntake = (schedule: Schedule, hour: number) => {
  const event = eventAt(schedule, hour);
  return event?.kind === 'meal'
    ? (event.calories ?? 0) / (event.end - event.start)
    : 0;
};

export const getCaloriesLevel = (calories: number): CaloriesLevel => {
  if (calories < CALORIES_MIN_TARGET) return 'low';
  return calories > CALORIES_MAX_TARGET ? 'high' : 'balanced';
};

export const getCaloriesStatus = (calories: number): CaloriesStatus => {
  if (calories < CALORIES_MIN_TARGET) return 'starving';
  if (calories < CALORIES_GOOD_MIN) return 'running-low';
  if (calories <= CALORIES_GOOD_MAX) return 'good';
  return calories <= CALORIES_MAX_TARGET ? 'running-high' : 'overflowing';
};

// Puts calories in the gauge; what does not fit in 100% becomes fat.
const addCalories = (state: Nutrition, amount: number): Nutrition => {
  const calories = state.calories + amount;
  return {
    calories: Math.min(calories, CALORIES_CAP),
    fat: state.fat + Math.max(calories - CALORIES_CAP, 0),
    cakeUntil: state.cakeUntil,
  };
};

export const eatSnack = (state: Nutrition) =>
  addCalories(state, SNACK_CALORIES);

export const startCake = (state: Nutrition, now: number): Nutrition => ({
  calories: state.calories,
  fat: state.fat,
  cakeUntil: now + CAKE_DURATION_HOURS,
});

export const isEnjoyingCake = (state: Nutrition, now: number) =>
  now < state.cakeUntil;

// Runs the game hours between `from` and `to`: calories go down, faster at
// work, up during meals and cakes, and the excess over 80% turns into fat.
export const stepNutrition = (
  state: Nutrition & Schedule,
  from: number,
  to: number,
): Nutrition => {
  let { calories, fat } = state;
  for (let time = from; time < to; time += STEP_HOURS) {
    const duration = Math.min(STEP_HOURS, to - time);
    const middle = time + duration / 2;
    const burn =
      eventAt(state, middle)?.kind === 'work' ? WORK_BURN : IDLE_BURN;
    const cake =
      middle < state.cakeUntil ? CAKE_CALORIES / CAKE_DURATION_HOURS : 0;

    calories += (mealIntake(state, middle) + cake - burn) * duration;
    if (calories > CALORIES_MAX_TARGET) {
      const converted =
        (calories - CALORIES_MAX_TARGET) *
        (1 - Math.exp(-FAT_CONVERSION_RATE * duration));
      calories -= converted;
      fat += converted;
    }
    if (calories > CALORIES_CAP) {
      fat += calories - CALORIES_CAP;
      calories = CALORIES_CAP;
    }
    calories = Math.max(calories, 0);
  }
  return { calories, fat, cakeUntil: state.cakeUntil };
};
