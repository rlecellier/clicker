import type { EventKind } from '@game/history';

import {
  CALORIES_CAP,
  CALORIES_GOOD_MAX,
  CALORIES_GOOD_MIN,
  CALORIES_MAX_TARGET,
  CALORIES_MIN_TARGET,
  FAT_CONVERSION_RATE,
  IDLE_BURN,
  INITIAL_CALORIES,
  STEP_HOURS,
  WORK_BURN,
} from './constants';
import type { CaloriesLevel, CaloriesStatus, Nutrition } from './types';

export const INITIAL_NUTRITION: Nutrition = {
  calories: INITIAL_CALORIES,
  fat: 0,
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

type NutritionStep = {
  kind: EventKind;
  hours: number;
  // calories (in % of the gauge) added over the whole step
  calories?: number;
};

// Runs an action: calories go down, faster at work, up during a meal, and the
// excess over 80% turns into fat.
export const stepNutrition = (
  state: Nutrition,
  { kind, hours, calories: intake = 0 }: NutritionStep,
): Nutrition => {
  let { calories, fat } = state;
  const burn = kind === 'work' ? WORK_BURN : IDLE_BURN;
  const intakePerHour = intake / hours;

  for (let done = 0; done < hours; done += STEP_HOURS) {
    const duration = Math.min(STEP_HOURS, hours - done);
    calories += (intakePerHour - burn) * duration;

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

  return { calories, fat };
};
