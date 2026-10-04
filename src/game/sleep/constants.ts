export const BRAIN_CAP = 100;
// A day is 16 awake hours that fill the gauge and 8 hours of sleep that
// empty it.
export const AWAKE_HOURS_PER_DAY = 16;
export const SLEEP_HOURS_PER_DAY = 8;
export const BRAIN_FILL_PER_HOUR = BRAIN_CAP / AWAKE_HOURS_PER_DAY;
export const BRAIN_DRAIN_PER_HOUR = BRAIN_CAP / SLEEP_HOURS_PER_DAY;
// The game starts on Monday at midnight, one hour after the night began.
export const INITIAL_BRAIN = BRAIN_CAP - BRAIN_DRAIN_PER_HOUR;
