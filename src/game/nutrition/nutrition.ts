import { EVENTS } from '@game/calendar';
import { isWorkHours } from '@game/earnings';
import { HOURS_PER_DAY, HOURS_PER_WEEK } from '@game/time';

import {
  CAKE_CALORIES,
  CAKE_DURATION_HOURS,
  CALORIES_CAP,
  CALORIES_MAX_TARGET,
  CALORIES_MIN_TARGET,
  FAT_CONVERSION_RATE,
  IDLE_BURN,
  INITIAL_CALORIES,
  SNACK_CALORIES,
  STEP_HOURS,
  WORK_BURN,
} from './constants';
import type { CaloriesLevel, Nutrition } from './types';

export const INITIAL_NUTRITION: Nutrition = {
  calories: INITIAL_CALORIES,
  fat: 0,
  cakeUntil: 0,
};

const MEALS = EVENTS.filter((event) => event.kind === 'meal');

// Calories per game hour given by the meals running at this hour of the week.
const mealIntake = (weekHour: number) => {
  let intake = 0;
  for (const meal of MEALS) {
    const duration = meal.end - meal.start;
    for (const day of meal.days) {
      const start = day * HOURS_PER_DAY + meal.start;
      if (weekHour >= start && weekHour < start + duration) {
        intake += (meal.calories ?? 0) / duration;
      }
    }
  }
  return intake;
};

export const getCaloriesLevel = (calories: number): CaloriesLevel => {
  if (calories < CALORIES_MIN_TARGET) return 'low';
  return calories > CALORIES_MAX_TARGET ? 'high' : 'balanced';
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
  state: Nutrition,
  from: number,
  to: number,
): Nutrition => {
  let { calories, fat } = state;
  for (let time = from; time < to; time += STEP_HOURS) {
    const duration = Math.min(STEP_HOURS, to - time);
    const middle = time + duration / 2;
    const weekHour = middle % HOURS_PER_WEEK;
    const burn = isWorkHours(weekHour) ? WORK_BURN : IDLE_BURN;
    const cake =
      middle < state.cakeUntil ? CAKE_CALORIES / CAKE_DURATION_HOURS : 0;

    calories += (mealIntake(weekHour) + cake - burn) * duration;
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
