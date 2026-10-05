import { expect, test } from '@playwright/test';

import { startGame } from './support';

test('Restart Game starts a new game', async ({ page }) => {
  await startGame(page);
  const clock = page.getByRole('timer', { name: 'Game time' });

  await page.getByRole('button', { name: /Look for a job/ }).click();
  await page.getByRole('button', { name: 'Clothes seller' }).click();
  await page.getByRole('button', { name: /Sleep 8h/ }).click();
  await expect(clock).toContainText('16:00');

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('button', { name: 'Restart Game' }).click();

  // The new game begins at the date and time of the player.
  await expect(clock).toContainText('07:00');
  await expect(
    page.getByRole('button', { name: 'Look for a job' }),
  ).toBeVisible();
  await expect(page.getByRole('meter', { name: 'Calories' })).toHaveAttribute(
    'aria-valuetext',
    '60%',
  );

  // The new game is the one saved: it is still there after a reload.
  await page.reload();
  await expect(clock).toContainText('07:00');
  await expect(
    page.getByRole('button', { name: 'Look for a job' }),
  ).toBeVisible();
});
