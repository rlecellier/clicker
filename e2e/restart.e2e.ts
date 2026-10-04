import { expect, test } from '@playwright/test';

// The game runs eight times faster than real time by default.
const HOUR_MS = 1000 / 8;

test('Restart Game starts a new game', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  const calendar = page.getByRole('img');
  await page.clock.fastForward(24 * HOUR_MS);
  await expect(calendar).toHaveAccessibleName('Tue, 00:00');

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('button', { name: 'Restart Game' }).click();
  await expect(calendar).toHaveAccessibleName('Mon, 00:00');
  await expect(page.getByRole('meter', { name: 'Calories' })).toHaveAttribute(
    'aria-valuetext',
    '60%',
  );

  // The new game is the one saved: it is still there after a reload.
  await page.reload();
  await expect(calendar).toHaveAccessibleName('Mon, 00:00');
});
