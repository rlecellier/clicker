import { expect, test } from '@playwright/test';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS_PER_DAY = 24;
const HOURS_PER_WEEK = HOURS_PER_DAY * DAYS.length;
const HOUR_MS = 1000;
const STEP_HOURS = 3;

const label = (weekHour: number) => {
  const day = DAYS[Math.floor(weekHour / HOURS_PER_DAY) % DAYS.length];
  const hour = String(weekHour % HOURS_PER_DAY).padStart(2, '0');
  return `${day}, ${hour}:00`;
};

test('the calendar walks through the week, one hour per second', async ({
  page,
}) => {
  // Paused, so that only the steps below make the game time move.
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  const calendar = page.getByRole('img');
  await expect(calendar).toHaveAccessibleName(label(0));

  for (let hour = STEP_HOURS; hour <= HOURS_PER_WEEK; hour += STEP_HOURS) {
    await page.clock.fastForward(STEP_HOURS * HOUR_MS);
    // The week starts over on Monday after Sunday night.
    await expect(calendar).toHaveAccessibleName(label(hour));
    // Slows the recording down so the cursor can be followed.
    await page.waitForTimeout(100);
  }
});
