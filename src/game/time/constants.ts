export const HOURS_PER_DAY = 24;
export const DAYS_PER_WEEK = 7;
export const HOURS_PER_WEEK = HOURS_PER_DAY * DAYS_PER_WEEK;

// Artificial calendar (ADR 0006): a week of the game is a month, so a year
// lasts 12 weeks.
export const WEEKS_PER_YEAR = 12;
export const DAYS_PER_YEAR = DAYS_PER_WEEK * WEEKS_PER_YEAR;
export const HOURS_PER_YEAR = DAYS_PER_YEAR * HOURS_PER_DAY;

// Game hours that go by in one real second while an action is running.
export const HOURS_PER_SECOND = 1;

// Time moves by half hours: every action lasts a whole number of them.
export const STEP_HOURS = 0.5;
