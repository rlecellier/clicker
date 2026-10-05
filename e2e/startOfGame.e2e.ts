import { expect, test } from '@playwright/test';

import { demoShot, openPage, startGame } from './support';

test('a new game starts at home, at the date and time of the player, with nothing done', async ({
  page,
}) => {
  await startGame(page, new Date(2026, 9, 7, 14, 45));

  // Wednesday 14:45 is played from 14:30: time moves by half hours.
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(clock).toContainText('Wed 7 Oct 2026');
  await expect(clock).toContainText('14:30');
  await expect(page.locator('[data-location]')).toHaveAttribute(
    'data-location',
    'home',
  );
  await expect(page.getByRole('status', { name: 'Gold coins' })).toHaveText(
    '0',
  );

  // At home: look for a job, eat, read and sleep. No work without a job.
  await expect(
    page.getByRole('button', { name: 'Look for a job' }),
  ).toBeEnabled();
  for (const name of [
    'Have breakfast',
    'Have lunch',
    'Have dinner',
    'Read 1h',
    'Read 2h',
    'Read 3h',
    'Sleep 2h',
    'Sleep 4h',
    'Sleep 6h',
    'Sleep 8h',
  ]) {
    await expect(
      page.getByRole('button', { name: new RegExp(name) }),
    ).toBeEnabled();
  }
  await expect(page.getByRole('button', { name: /Go to work/ })).toHaveCount(0);

  // The calendar is empty: nothing done, nothing required.
  await openPage(page, 'Calendar');
  await expect(page.getByRole('listitem')).toHaveCount(0);
  await demoShot(page, 'empty-calendar');
});

test('the game time only moves when the player acts', async ({ page }) => {
  await startGame(page);
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(clock).toContainText('07:00');

  await page.waitForTimeout(1500);
  await expect(clock).toContainText('07:00');

  await page.getByRole('button', { name: /Have breakfast/ }).click();
  await expect(clock).toContainText('07:30');
});
