import { expect, test } from '@playwright/test';

import { startGame } from './support';

test('the game is saved and resumed when the page is reloaded', async ({
  page,
}) => {
  await startGame(page);

  // A few actions: the state is no longer the initial one.
  await page.getByRole('button', { name: /Have breakfast/ }).click();
  await page.getByRole('button', { name: /Look for a job/ }).click();
  await page.getByRole('button', { name: 'Clothes seller' }).click();
  await page.getByRole('button', { name: 'Go to work' }).click();
  await page.getByRole('button', { name: /^Work/ }).click();
  const calories = page.getByRole('meter', { name: 'Calories' });
  const caloriesBefore = await calories.getAttribute('aria-valuetext');
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(clock).toContainText('09:00');

  await page.reload();

  await expect(clock).toContainText('09:00');
  await expect(page.getByRole('status', { name: 'Gold coins' })).toHaveText(
    '5',
  );
  await expect(calories).toHaveAttribute(
    'aria-valuetext',
    caloriesBefore ?? '',
  );
  // still at work, still in the shift
  await expect(page.getByRole('button', { name: 'Go home' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Job' })).toContainText(
    'Clothes seller',
  );
});

test('a broken save is ignored and a new game starts', async ({ page }) => {
  await startGame(page);
  await page.evaluate(() => {
    localStorage.setItem('clicker.save', '{"version":1,"state":{"oops":true}}');
  });
  await page.reload();

  await expect(page.getByRole('timer')).toContainText('07:00');
  await expect(page.getByRole('meter', { name: 'Calories' })).toHaveAttribute(
    'aria-valuetext',
    '60%',
  );
});
