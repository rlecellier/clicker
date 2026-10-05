import { expect, test } from '@playwright/test';

import { demoShot, getAJob, openPage, startGame } from './support';

const coins = (page: import('@playwright/test').Page) =>
  page.getByRole('status', { name: 'Gold coins' });

test('a working morning: every click is half an hour of work, paid at once', async ({
  page,
}) => {
  await startGame(page);
  await getAJob(page);

  // Going to work takes no time.
  await page.getByRole('button', { name: 'Go to work' }).click();
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(clock).toContainText('08:00');
  await expect(page.locator('[data-location]')).toHaveAttribute(
    'data-location',
    'work',
  );
  await expect(page.getByRole('button', { name: 'Go home' })).toBeVisible();
  // At work: no more eating, reading or sleeping.
  await expect(page.getByRole('button', { name: /Have lunch/ })).toHaveCount(0);

  await page.getByRole('button', { name: /^Work/ }).click();
  await expect(clock).toContainText('08:30');
  await expect(coins(page)).toHaveText('5');
  await page.getByRole('button', { name: /^Work/ }).click();
  await expect(clock).toContainText('09:00');
  await expect(coins(page)).toHaveText('10');
  await demoShot(page, 'working');

  // Six more clicks finish the morning shift: back home on their own.
  for (let click = 0; click < 6; click += 1) {
    await page.getByRole('button', { name: /^Work/ }).click();
  }
  await expect(clock).toContainText('12:00');
  await expect(coins(page)).toHaveText('40');
  await expect(page.locator('[data-location]')).toHaveAttribute(
    'data-location',
    'home',
  );
  await expect(page.getByRole('button', { name: /^Work/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Go to work' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Job' })).toContainText(
    'Next shift today, 13:00 – 18:00',
  );

  // The eight clicks are one entry of the calendar, beside the shift.
  await openPage(page, 'Calendar');
  await expect(page.getByTitle(/^Work /)).toHaveCount(1);
  await expect(page.getByTitle('Work 08:00–12:00')).toBeVisible();
  await expect(page.getByTitle('Must: Sell clothes 08:00–12:00')).toHaveCount(
    1,
  );
  await demoShot(page, 'merged-work');

  // The pay is on the balance page.
  await openPage(page, 'Balance');
  await expect(page.getByText('Earned at work').locator('..')).toContainText(
    '40',
  );
  await expect(page.getByText('Time worked').locator('..')).toContainText('4h');
});

test('work is only possible during the working hours, and the player can walk back home', async ({
  page,
}) => {
  await startGame(page);
  await getAJob(page);
  await page.getByRole('button', { name: 'Go to work' }).click();
  for (let click = 0; click < 8; click += 1) {
    await page.getByRole('button', { name: /^Work/ }).click();
  }

  // Noon is the lunch break: there is nothing to work on yet.
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(clock).toContainText('12:00');
  await page.getByRole('button', { name: 'Go to work' }).click();
  const work = page.getByRole('button', { name: /^Work/ });
  await expect(work).toBeDisabled();
  await expect(work).toContainText('Not your working hours');
  await page.getByRole('button', { name: 'Go home' }).click();
  await expect(clock).toContainText('12:00');

  // After lunch, the afternoon shift can be worked.
  await page.getByRole('button', { name: /Have lunch/ }).click();
  await expect(clock).toContainText('13:00');
  await page.getByRole('button', { name: 'Go to work' }).click();
  await work.click();
  await expect(clock).toContainText('13:30');

  // Leaving work in the middle of the shift is possible, and costs no time.
  await page.getByRole('button', { name: 'Go home' }).click();
  await expect(page.locator('[data-location]')).toHaveAttribute(
    'data-location',
    'home',
  );
  await expect(clock).toContainText('13:30');

  // Sleeping the night away: the evening has no shift left.
  await page.getByRole('button', { name: /Sleep 8h/ }).click();
  await page.getByRole('button', { name: 'Go to work' }).click();
  await expect(work).toBeDisabled();
});
