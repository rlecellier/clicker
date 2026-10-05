import { expect, test } from '@playwright/test';

import { elapse, getAJob, perform, startGame } from './support';

test('the game is saved and resumed when the page is reloaded', async ({
  page,
}) => {
  await startGame(page);

  // A few actions: the state is no longer the initial one.
  await perform(page, /Have breakfast/, 0.5);
  await getAJob(page);
  await page.getByRole('button', { name: 'Go to work' }).click();
  await perform(page, /^Work/, 0.5);
  const calories = page.getByRole('meter', { name: 'Calories' });
  const caloriesBefore = await calories.getAttribute('aria-valuetext');
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(clock).toContainText('09:00');

  await page.reload();

  await expect(clock).toContainText('09:00');
  await expect(page.getByRole('status', { name: 'Gold coins' })).toHaveText(
    '25',
  );
  await expect(page.getByRole('meter', { name: 'Fridge' })).toHaveAttribute(
    'aria-valuetext',
    '9 / 10',
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

test('an action that is not over is not saved: the game resumes before it', async ({
  page,
}) => {
  await startGame(page);
  await perform(page, /Have breakfast/, 0.5);
  await page.getByRole('button', { name: /Sleep 8h/ }).click();
  await elapse(page, 3);
  await expect(page.getByRole('timer')).toContainText(/10:[3-5]\d/);

  await page.reload();

  // The sleep starts over: back to the end of the breakfast.
  await expect(page.getByRole('timer')).toContainText('07:30');
  await expect(
    page.getByRole('meter', { name: 'Action in progress' }),
  ).toBeHidden();
  await expect(page.getByRole('button', { name: /Sleep 8h/ })).toBeEnabled();
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
