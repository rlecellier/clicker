import { HOURS_PER_DAY } from '@game/time';

import { HOURS_PER_YEAR, START_AGE } from './constants';

// Age in whole years of the player, after the given game hours.
export const ageAt = (elapsedHours: number) =>
  START_AGE + Math.floor(elapsedHours / HOURS_PER_YEAR);

// Day the player was born, as YYYY-MM-DD: START_AGE years before the day the
// game is launched, so the birthday is the day of the launch.
export const birthDateOf = (launchDay: Date) =>
  new Date(
    Date.UTC(
      launchDay.getFullYear() - START_AGE,
      launchDay.getMonth(),
      launchDay.getDate(),
    ),
  )
    .toISOString()
    .slice(0, 10);

// Game time lived since the game started, split in whole years and days.
export const lifeTimeAt = (elapsedHours: number) => ({
  years: Math.floor(elapsedHours / HOURS_PER_YEAR),
  days: Math.floor((elapsedHours % HOURS_PER_YEAR) / HOURS_PER_DAY),
});
