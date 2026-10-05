// Calories are a gauge in % that the player keeps between 20 and 80.
export const CALORIES_MIN_TARGET = 20;
export const CALORIES_MAX_TARGET = 80;
// Inside 20%–80%, the part that is comfortable (green) and the rest (yellow).
export const CALORIES_GOOD_MIN = 40;
export const CALORIES_GOOD_MAX = 60;
export const CALORIES_CAP = 100;
export const INITIAL_CALORIES = 60;
// Calories burnt per game hour, resting and at work.
export const IDLE_BURN = 2;
export const WORK_BURN = 3.4;
// Share of the excess over 80% turned into fat each game hour; the bigger
// the excess, the more calories are converted per hour.
export const FAT_CONVERSION_RATE = 1.5;
// Game hours simulated in one step, so that a long action is not skipped.
export const STEP_HOURS = 0.05;
