import { expect, test } from '@playwright/test';

import { demoShot, elapse, openPage, perform, startGame } from './support';

// One long day at home: every action of the home page, in a row.
test('a day at home: eat, shop, sleep, read and think', async ({ page }) => {
  // The first book of the library is drawn: Animal Farm, six hours.
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await startGame(page);
  const clock = page.getByRole('timer', { name: 'Game time' });
  const fridge = page.getByRole('meter', { name: 'Fridge' });
  const progress = page.getByRole('meter', { name: 'Action in progress' });
  const book = page.getByRole('meter', { name: 'Animal Farm' });

  // A new game: at home, with a few coins and a full fridge, nothing done.
  await expect(clock).toContainText('Mon 1 Oct 2026');
  await expect(clock).toContainText('07:00');
  await expect(page.getByText('18 yo')).toBeVisible();
  await expect(page.getByRole('status', { name: 'Gold coins' })).toHaveText(
    '20',
  );
  await expect(page.locator('[data-location]')).toHaveAttribute(
    'data-location',
    'home',
  );
  await expect(fridge).toHaveAttribute('aria-valuetext', '10 / 10');
  await expect(page.getByRole('button', { name: /Go to work/ })).toHaveCount(0);
  await openPage(page, 'Calendar');
  await expect(page.getByRole('main').getByRole('listitem')).toHaveCount(0);
  await demoShot(page, 'empty-calendar');
  await openPage(page, 'Game');

  // The time only moves while an action runs.
  await elapse(page, 3);
  await expect(clock).toContainText('07:00');

  // Meals: half an hour, an hour, an hour. Three in a row are too much.
  await perform(page, /Have breakfast/, 0.5);
  await expect(clock).toContainText('07:30');
  await expect(fridge).toHaveAttribute('aria-valuetext', '9 / 10');
  await perform(page, /Have lunch/, 1);
  await perform(page, /Have dinner/, 1);
  await expect(clock).toContainText('09:30');
  await expect(fridge).toHaveAttribute('aria-valuetext', '7 / 10');
  const carrot = page.getByRole('button', { name: 'Calories status' });
  await expect(carrot).toHaveAttribute('data-status', 'overflowing');
  await carrot.click();
  await expect(page.getByText('Too much energy')).toBeVisible();

  // Shopping takes an hour and fills the fridge once it is over.
  await page.getByRole('button', { name: /Go shopping/ }).click();
  await expect(fridge).toHaveAttribute('aria-valuetext', '7 / 10');
  await elapse(page, 1);
  await expect(clock).toContainText('10:30');
  await expect(fridge).toHaveAttribute('aria-valuetext', '10 / 10');
  await expect(
    page.getByRole('button', { name: /Go shopping/ }),
  ).toBeDisabled();
  await demoShot(page, 'fridge');

  // Time runs at one game hour per second, one action at a time.
  await page.getByRole('button', { name: /Sleep 4h/ }).click();
  await expect(clock).toContainText('10:30');
  await expect(progress).toHaveAttribute('aria-valuetext', 'Sleep, 0%');
  await elapse(page, 2);
  await expect(clock).toContainText(/12:[3-5]\d/);
  await expect(progress).toHaveAttribute('aria-valuetext', /Sleep, (5|6)\d%/);
  await demoShot(page, 'time-running');
  await expect(page.getByRole('button', { name: /Sleep 2h/ })).toBeDisabled();
  await elapse(page, 2);
  await expect(clock).toContainText('14:30');
  await expect(progress).toBeHidden();

  // Reading draws a book and moves it on; it is listed once read.
  await expect(book).toBeHidden();
  await perform(page, 'Read 1h', 1);
  await expect(book).toHaveAttribute('aria-valuetext', '16%');
  await perform(page, 'Read 2h', 2);
  await expect(book).toHaveAttribute('aria-valuetext', '50%');
  await openPage(page, 'Achievements');
  await expect(page.getByText('No book read yet.')).toBeVisible();
  await openPage(page, 'Game');
  await perform(page, 'Read 3h', 3);
  await expect(clock).toContainText('20:30');
  await openPage(page, 'Achievements');
  await expect(page.getByText('Books read (1)')).toBeVisible();
  await expect(page.getByText('George Orwell')).toBeVisible();
  await openPage(page, 'Game');

  // Thinking, then a night's sleep that goes past midnight.
  await perform(page, 'Think 30 min', 0.5);
  await perform(page, 'Think 1h', 1);
  await perform(page, 'Think 2h', 2);
  await expect(clock).toContainText('00:00');
  await perform(page, /Sleep 2h/, 2);
  await perform(page, /Sleep 6h/, 6);
  await expect(clock).toContainText('Tue 2 Oct 2026');
  await expect(clock).toContainText('08:00');

  // Actions in a row are one entry of the calendar, cut at midnight.
  await openPage(page, 'Calendar');
  await expect(page.getByTitle('Sleep 00:00–08:00')).toBeVisible();
  await demoShot(page, 'merged-sleep');
  await page.getByRole('button', { name: 'Previous day' }).click();
  await expect(page.getByTitle('Think 20:30–00:00')).toBeVisible();

  // The days strip follows the game time on every page.
  const strip = page.getByRole('img', { name: /Oct 2026, / });
  for (const name of ['Balance', 'Profile', 'Game']) {
    await openPage(page, name);
    await expect(strip).toHaveAccessibleName('Tue 2 Oct 2026, 08:00');
  }
  await openPage(page, 'Profile');
  await expect(page.getByText('1.70 m')).toBeVisible();
  await expect(page.getByText('Played').locator('..')).toContainText('1 d');
  await demoShot(page, 'days-strip');
});
