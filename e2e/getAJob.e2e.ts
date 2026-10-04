import { expect, test } from '@playwright/test';

import { demoShot, getAJob } from './support';

test('Get a Job offers the jobs, and the one picked shapes the calendar', async ({
  page,
}) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  // No job yet: nothing to do at work, nothing to earn.
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Calendar' }).click();
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Go to work' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Game' }).click();

  // The jobs open in a sheet that can be closed.
  await page.getByRole('button', { name: 'Get a Job' }).click();
  await expect(page.getByRole('dialog', { name: 'Get a Job' })).toBeVisible();
  await demoShot(page, 'get-a-job');
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await getAJob(page);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Get a Job' })).toHaveCount(0);

  // The job requires work and the player plans to go there, at the same hours.
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Calendar' }).click();
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Go to work' }),
  ).toHaveCount(2);
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Must: Sell clothes' }),
  ).toHaveCount(2);
  await demoShot(page, 'job-calendar');
});
