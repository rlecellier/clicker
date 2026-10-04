export const HOURS_PER_DAY = 24;
export const DAYS_PER_WEEK = 7;
export const HOURS_PER_WEEK = HOURS_PER_DAY * DAYS_PER_WEEK;
export const MS_PER_DAY = HOURS_PER_DAY * 3600 * 1000;
// Monday of the first game week; February 2027 has 28 days.
export const GAME_START = Date.UTC(2027, 1, 1);

// Game hours that go by in one real second at speed ×1.
export const HOURS_PER_SECOND = 1;
// Time multipliers the debug controls step through.
export const SPEEDS = [0.25, 0.5, 1, 2, 4, 8, 16, 32];
export const DEFAULT_SPEED = 8;
export const DEFAULT_SPEED_INDEX = SPEEDS.indexOf(DEFAULT_SPEED);
