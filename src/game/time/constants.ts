export const HOURS_PER_DAY = 24;
export const DAYS_PER_WEEK = 7;
export const HOURS_PER_WEEK = HOURS_PER_DAY * DAYS_PER_WEEK;
export const MS_PER_DAY = HOURS_PER_DAY * 3600 * 1000;
// Monday of the first game week; February 2027 has 28 days.
export const GAME_START = Date.UTC(2027, 1, 1);
