export const BRAIN_CAP = 100;
export const DREAM_CAP = 100;
// A day is 16 awake hours that fill the gauge and 8 hours of sleep that
// empty it.
export const AWAKE_HOURS_PER_DAY = 16;
export const SLEEP_HOURS_PER_DAY = 8;
// A day spent doing nothing fills 10% of the gauge...
export const BRAIN_IDLE_FILL_PER_DAY = 10;
export const BRAIN_IDLE_FILL_PER_HOUR =
  BRAIN_IDLE_FILL_PER_DAY / AWAKE_HOURS_PER_DAY;
// ...and every activity fills it faster, on top of that. A working weekday
// ends around 30%.
export const BRAIN_ACTIVITY_FILL_PER_HOUR = {
  work: 2,
  meal: 1.6,
  read: 0,
  search: 1,
};
// A full night empties 80% of the gauge.
export const BRAIN_SLEEP_DRAIN = 80;
export const BRAIN_DRAIN_PER_HOUR = BRAIN_SLEEP_DRAIN / SLEEP_HOURS_PER_DAY;
// A new game starts with a part of a day already behind the player.
export const INITIAL_BRAIN = 20;
