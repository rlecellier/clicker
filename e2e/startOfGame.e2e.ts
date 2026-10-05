import { expect, test } from '@playwright/test';

import { demoShot, elapse, openPage, perform, startGame } from './support';

test('a new game starts at home, at the date and time of the player, with nothing done', async ({
  page,
}) => {
  await startGame(page, new Date(2026, 9, 7, 14, 45));

  // Wednesday 14:45 is played from 14:30: time moves by half hours.
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(clock).toContainText('Wed 3 Oct 2026');
  await expect(clock).toContainText('14:30');
  await expect(page.locator('[data-location]')).toHaveAttribute(
    'data-location',
    'home',
  );
  // A few coins and a full fridge to begin with.
  await expect(page.getByRole('status', { name: 'Gold coins' })).toHaveText(
    '20',
  );
  await expect(page.getByRole('meter', { name: 'Fridge' })).toHaveAttribute(
    'aria-valuetext',
    '10 / 10',
  );

  // At home: look for a job, eat, read, sleep and think. No work without a job.
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
    'Think 30 min',
    'Think 1h',
    'Think 2h',
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

test('the game time only moves while an action runs', async ({ page }) => {
  await startGame(page);
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(clock).toContainText('07:00');

  await elapse(page, 3);
  await expect(clock).toContainText('07:00');

  await perform(page, /Have breakfast/, 0.5);
  await expect(clock).toContainText('07:30');

  await elapse(page, 3);
  await expect(clock).toContainText('07:30');
});

test('the days strip scrolls with the game time on every page', async ({
  page,
}) => {
  await startGame(page);
  const strip = page.getByRole('img', { name: /Oct 2026, / });
  await expect(strip).toHaveAccessibleName('Mon 1 Oct 2026, 07:00');

  await perform(page, /Sleep 8h/, 8);
  await expect(strip).toHaveAccessibleName('Mon 1 Oct 2026, 15:00');

  for (const name of ['Calendar', 'Balance', 'Profile', 'Game']) {
    await openPage(page, name);
    await expect(strip).toBeVisible();
    await expect(strip).toHaveAccessibleName('Mon 1 Oct 2026, 15:00');
  }
  await demoShot(page, 'days-strip');
});
