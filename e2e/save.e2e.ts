import { expect, test } from '@playwright/test';

// The game runs eight times faster than real time by default.
const HOUR_MS = 1000 / 8;

test('the game is saved and resumed when the page is reloaded', async ({
  page,
}) => {
  // Paused, so that only the steps below make the game time move.
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  // A day goes by, then a snack: the state is no longer the initial one.
  await page.clock.fastForward(24 * HOUR_MS);
  await page.getByRole('button', { name: /Eat a snack/ }).click();
  const calories = page.getByRole('meter', { name: 'Calories' });
  const caloriesBefore = await calories.getAttribute('aria-valuetext');
  const calendar = page.getByRole('img');
  await expect(calendar).toHaveAccessibleName('Tue, 00:00');

  // Closing the page saves the game.
  await page.reload();

  await expect(calendar).toHaveAccessibleName('Tue, 00:00');
  await expect(calories).toHaveAttribute(
    'aria-valuetext',
    caloriesBefore ?? '',
  );
  await page.waitForTimeout(500);
});

test('a broken save is ignored and a new game starts', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('clicker.save', '{"version":1,"state":{"oops":true}}');
  });
  await page.reload();

  await expect(page.getByRole('img')).toHaveAccessibleName('Mon, 00:00');
  await expect(page.getByRole('meter', { name: 'Calories' })).toHaveAttribute(
    'aria-valuetext',
    '50%',
  );
});
