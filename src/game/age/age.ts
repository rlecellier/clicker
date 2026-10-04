import { HOURS_PER_YEAR, START_AGE } from './constants';

// Age in whole years of the player, after the given game hours.
export const ageAt = (elapsedHours: number) =>
  START_AGE + Math.floor(elapsedHours / HOURS_PER_YEAR);
