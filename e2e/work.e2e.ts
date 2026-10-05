import { expect, test, type Page } from '@playwright/test';

import {
  demoShot,
  elapse,
  getAJob,
  openPage,
  perform,
  startGame,
} from './support';

const coins = (page: Page) => page.getByRole('status', { name: 'Gold coins' });

// From the job hunt to the pay, with lunch eaten out in the middle.
test('look for a job, work a morning, eat out and come back home', async ({
  page,
}) => {
  await startGame(page);
  const clock = page.getByRole('timer', { name: 'Game time' });
  const location = page.locator('[data-location]');

  // The jobs open in a sheet that can be closed.
  await page.getByRole('button', { name: 'Look for a job' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Look for a job' }),
  ).toBeVisible();
  await demoShot(page, 'look-for-a-job');
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(clock).toContainText('07:00');

  // Looking takes an hour, then the job is taken.
  await getAJob(page);
  await expect(clock).toContainText('08:00');
  await expect(
    page.getByRole('button', { name: 'Look for a job' }),
  ).toHaveCount(0);
  const job = page.getByRole('region', { name: 'Job' });
  await expect(job).toContainText('Clothes seller');
  await expect(job).toContainText('10 coins / hour');
  await openPage(page, 'Calendar');
  await expect(page.getByTitle(/^Must: Sell clothes/)).toHaveCount(2);
  await expect(page.getByTitle('Job hunt 07:00–08:00')).toBeVisible();
  await openPage(page, 'Game');

  // Going to work takes no time; the pay comes in as the hours go by.
  await page.getByRole('button', { name: 'Go to work' }).click();
  await expect(location).toHaveAttribute('data-location', 'work');
  await expect(clock).toContainText('08:00');
  await expect(coins(page)).toHaveText('1,000');
  await page.getByRole('button', { name: /^Work/ }).click();
  await expect(page.getByRole('button', { name: 'Go home' })).toBeDisabled();
  await elapse(page, 0.5);
  await expect(coins(page)).toHaveText('1,005');
  await demoShot(page, 'working');
  for (let click = 0; click < 7; click += 1) {
    await perform(page, /^Work/, 0.5);
  }
  await expect(clock).toContainText('12:00');
  await expect(coins(page)).toHaveText('1,040');
  await expect(job).toContainText('Next shift today, 13:00 – 18:00');

  await openPage(page, 'Calendar');
  await expect(page.getByTitle('Work 08:00–12:00')).toBeVisible();
  await demoShot(page, 'merged-work');
  await openPage(page, 'Balance');
  await expect(page.getByText('Earned at work').locator('..')).toContainText(
    '40',
  );
  await expect(page.getByText('Time worked').locator('..')).toContainText('4h');
  await openPage(page, 'Game');

  // Noon is the lunch break: still at work, where lunch is paid for.
  await expect(location).toHaveAttribute('data-location', 'work');
  await expect(page.getByRole('button', { name: /^Work/ })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Eat out' })).toContainText(
    '8 coins',
  );
  await perform(page, 'Eat out', 1);
  await expect(clock).toContainText('13:00');
  await expect(coins(page)).toHaveText('1,032');
  await demoShot(page, 'eat-out');
  await perform(page, /^Work/, 0.5);
  await expect(coins(page)).toHaveText('1,037');

  // Leaving costs no time; thinking is possible at work too.
  await page.getByRole('button', { name: 'Go home' }).click();
  await expect(location).toHaveAttribute('data-location', 'home');
  await expect(clock).toContainText('13:30');
  await page.getByRole('button', { name: 'Go to work' }).click();
  await perform(page, 'Think 1h', 1);
  await expect(clock).toContainText('14:30');
  await expect(location).toHaveAttribute('data-location', 'work');

  // Actions of the other place are queued: they start once the player is there.
  await openPage(page, 'Places');
  await page.getByRole('link', { name: /Home/ }).click();
  await page.getByRole('button', { name: /Have a snack/ }).click();
  await page.getByRole('button', { name: /Have a meal/ }).click();
  const queue = page.getByRole('region', { name: 'Queued actions' });
  await expect(queue).toContainText('Have a snack');
  await expect(queue).toContainText('Have a meal');
  await expect(clock).toContainText('14:30');
  await openPage(page, 'Game');
  await page.getByRole('button', { name: 'Go home' }).click();
  await expect(
    page.getByRole('meter', { name: 'Action in progress' }),
  ).toHaveAttribute('aria-valuetext', 'Snack, 0%');
  await expect(queue).toContainText('Have a meal');
  await expect(queue).not.toContainText('Have a snack');
});
