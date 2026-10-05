import { expect, test } from '@playwright/test';

import { demoShot, getAJob, openPage, startGame } from './support';

test('Look for a job offers the jobs, and the one picked shows its hours in the calendar', async ({
  page,
}) => {
  await startGame(page);

  // No job yet: nothing required in the calendar.
  await openPage(page, 'Calendar');
  await expect(page.getByTitle(/^Must/)).toHaveCount(0);
  await openPage(page, 'Game');

  // The jobs open in a sheet that can be closed.
  await page.getByRole('button', { name: 'Look for a job' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Look for a job' }),
  ).toBeVisible();
  await demoShot(page, 'look-for-a-job');
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('timer')).toContainText('07:00');

  // Looking takes an hour, then the job is taken and one cannot look again.
  await getAJob(page);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('timer')).toContainText('08:00');
  await expect(
    page.getByRole('button', { name: 'Look for a job' }),
  ).toHaveCount(0);
  const job = page.getByRole('region', { name: 'Job' });
  await expect(job).toContainText('Clothes seller');
  await expect(job).toContainText('10 coins / hour');
  await expect(job).toContainText('Sell clothes until 12:00');
  await expect(page.getByRole('button', { name: 'Go to work' })).toBeVisible();

  // The calendar shows the hours the job requires, and the hour spent looking.
  await openPage(page, 'Calendar');
  // the mobile calendar shows one day: Monday, with its two shifts
  await expect(page.getByTitle(/^Must: Sell clothes/)).toHaveCount(2);
  await expect(page.getByTitle('Job hunt 07:00–08:00')).toBeVisible();
  await demoShot(page, 'job-calendar');
});
