export const MONTHLY_SALARY = 1000;
// Monday of the first game week; February 2027 has 28 days.
export const GAME_START = Date.UTC(2027, 1, 1);

// Calories are a gauge in % that the player keeps between 20 and 80.
export const CALORIES_MIN_TARGET = 20;
export const CALORIES_MAX_TARGET = 80;
export const CALORIES_CAP = 100;
export const INITIAL_CALORIES = 50;
// Calories burnt per game hour, resting and at work.
export const IDLE_BURN = 2;
export const WORK_BURN = 4;
// Share of the excess over 80% turned into fat each game hour; the bigger
// the excess, the more calories are converted per hour.
export const FAT_CONVERSION_RATE = 1.5;
export const SNACK_CALORIES = 10;
export const CAKE_CALORIES = 20;
export const CAKE_DURATION_HOURS = 0.5;
// Game hours simulated in one step, so that a long frame is not skipped.
export const STEP_HOURS = 0.05;
