import { GAME_START, HOURS_PER_DAY } from '@game/time';

import { HOURS_PER_YEAR, START_AGE } from './constants';

// Age in whole years of the player, after the given game hours.
export const ageAt = (elapsedHours: number) =>
  START_AGE + Math.floor(elapsedHours / HOURS_PER_YEAR);

// Day the player was born: START_AGE years before the game starts.
export const BIRTH_DATE = (() => {
  const start = new Date(GAME_START);
  return new Date(
    Date.UTC(
      start.getUTCFullYear() - START_AGE,
      start.getUTCMonth(),
      start.getUTCDate(),
    ),
  );
})();

// Game time lived since the game started, split in whole years and days.
export const lifeTimeAt = (elapsedHours: number) => ({
  years: Math.floor(elapsedHours / HOURS_PER_YEAR),
  days: Math.floor((elapsedHours % HOURS_PER_YEAR) / HOURS_PER_DAY),
});
