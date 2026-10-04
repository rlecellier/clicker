import { expect, test } from '@playwright/test';

// The game runs eight times faster than real time by default.
const HOUR_MS = 1000 / 8;

test('snacks and cakes feed the calories gauge', async ({ page }) => {
  // Paused, so that only the steps below make the game time move.
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  const calories = page.getByRole('meter', { name: 'Calories' });
  await expect(calories).toHaveAttribute('aria-valuetext', '50%');

  await page.getByRole('button', { name: /Eat a snack/ }).click();
  await expect(calories).toHaveAttribute('aria-valuetext', '60%');
  await page.waitForTimeout(500);

  // The night burns calories: six hours at two per hour.
  await page.clock.fastForward(6 * HOUR_MS);
  await expect(calories).toHaveAttribute('aria-valuetext', '48%');
  await page.waitForTimeout(500);

  // A cake lasts half an hour of game time, work or not.
  await page.getByRole('button', { name: /Enjoy a cake/ }).click();
  await expect(
    page.getByRole('button', { name: /Enjoying a cake/ }),
  ).toBeDisabled();
  await page.clock.fastForward(1 * HOUR_MS);
  await expect(
    page.getByRole('button', { name: /Enjoy a cake/ }),
  ).toBeEnabled();
});
