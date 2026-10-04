import { expect, test } from '@playwright/test';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOUR_MS = 1000;

test('the calendar walks through the week, one hour per second', async ({
  page,
}) => {
  // Paused, so that only the steps below make the game time move.
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  const calendar = page.getByRole('img');
  await expect(calendar).toHaveAccessibleName('Mon, 00:00');

  for (const [index, day] of DAYS.entries()) {
    // Noon of each day.
    await page.clock.fastForward((index === 0 ? 12 : 24) * HOUR_MS);
    await expect(calendar).toHaveAccessibleName(`${day}, 12:00`);
    // Lets the recording show the cursor moving from day to day.
    await page.waitForTimeout(250);
  }

  // Past Sunday night the week starts over on Monday.
  await page.clock.fastForward(12 * HOUR_MS);
  await expect(calendar).toHaveAccessibleName('Mon, 00:00');
});
