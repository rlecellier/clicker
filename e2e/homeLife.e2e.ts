import { expect, test } from '@playwright/test';

import {
  demoShot,
  elapse,
  openPage,
  startGame,
  choose,
  performChoice,
} from './support';

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
  await expect(clock).toContainText('08:00');
  await expect(page.getByText('18 yo')).toBeVisible();
  await expect(page.getByRole('status', { name: 'Gold coins' })).toHaveText(
    '1,000',
  );
  await expect(page.locator('[data-location]')).toHaveAttribute(
    'data-location',
    'home',
  );
  await expect(fridge).toHaveAttribute('aria-valuetext', '10 / 10');
  await expect(page.getByRole('combobox', { name: 'Destination' })).toHaveCount(
    0,
  );
  await openPage(page, 'Calendar');
  await expect(page.getByRole('main').getByRole('listitem')).toHaveCount(0);
  await demoShot(page, 'empty-calendar');
  await openPage(page, 'Game');

  // The actions are split by where they come from: the place, the player.
  await expect(
    page
      .getByRole('region', { name: 'At home' })
      .getByRole('combobox', { name: 'Eat choice' }),
  ).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'You' }).getByRole('button', {
      name: 'Think',
    }),
  ).toBeVisible();

  // The time only moves while an action runs.
  await elapse(page, 3);
  await expect(clock).toContainText('08:00');

  // Meals: half an hour, then an hour. Two in a row are too much.
  await performChoice(page, 'Eat', 'Snack', 0.5);
  await expect(clock).toContainText('08:30');
  await expect(fridge).toHaveAttribute('aria-valuetext', '9 / 10');
  await performChoice(page, 'Eat', 'Meal', 1);
  await expect(clock).toContainText('09:30');
  await expect(fridge).toHaveAttribute('aria-valuetext', '8 / 10');
  const carrot = page.getByRole('button', { name: 'Calories status' });
  await expect(carrot).toHaveAttribute('data-status', 'overflowing');
  await carrot.click();
  await expect(page.getByText('Too much energy')).toBeVisible();

  // An hour to think while digesting.
  await performChoice(page, 'Think', '1h', 1);
  await expect(clock).toContainText('10:30');

  // Shopping takes an hour and fills the fridge once it is over.
  await page.getByRole('button', { name: /Go shopping/ }).click();
  await expect(fridge).toHaveAttribute('aria-valuetext', '8 / 10');
  await elapse(page, 1);
  await expect(clock).toContainText('11:30');
  await expect(fridge).toHaveAttribute('aria-valuetext', '10 / 10');
  await expect(
    page.getByRole('button', { name: /Go shopping/ }),
  ).toBeDisabled();
  await demoShot(page, 'fridge');

  // Time runs at one game hour per second, one action at a time.
  await choose(page, 'Sleep', '4h');
  await expect(clock).toContainText('11:30');
  await expect(progress).toHaveAttribute('aria-valuetext', 'Sleep, 0%');
  await elapse(page, 2);
  await expect(clock).toContainText(/13:[3-5]\d/);
  await expect(progress).toHaveAttribute('aria-valuetext', /Sleep, (5|6)\d%/);
  await demoShot(page, 'time-running');
  // An action asked for while busy waits in the queue, and can be cancelled.
  await choose(page, 'Sleep', '2h');
  await expect(
    page.getByRole('region', { name: 'Queued actions' }),
  ).toContainText('Sleep');
  await page.getByRole('button', { name: /^Cancel Sleep/ }).click();
  await expect(
    page.getByRole('region', { name: 'Queued actions' }),
  ).toHaveCount(0);
  await elapse(page, 2);
  await expect(clock).toContainText('15:30');
  await expect(progress).toBeHidden();

  // Reading draws a book and moves it on; it is listed once read.
  await expect(book).toBeHidden();
  await performChoice(page, 'Read', '1h', 1);
  await expect(book).toHaveAttribute('aria-valuetext', '16%');
  await performChoice(page, 'Read', '2h', 2);
  await expect(book).toHaveAttribute('aria-valuetext', '50%');
  await openPage(page, 'Achievements');
  await expect(page.getByText('No book read yet.')).toBeVisible();
  await openPage(page, 'Game');
  await performChoice(page, 'Read', '3h', 3);
  await expect(clock).toContainText('21:30');
  await openPage(page, 'Achievements');
  await expect(page.getByText('Books read (1)')).toBeVisible();
  await expect(page.getByText('George Orwell')).toBeVisible();
  await openPage(page, 'Game');

  // Thinking, then a night's sleep that goes past midnight.
  await performChoice(page, 'Think', '30 min', 0.5);
  await performChoice(page, 'Think', '2h', 2);
  await expect(clock).toContainText('00:00');
  await performChoice(page, 'Sleep', '2h', 2);
  await performChoice(page, 'Sleep', '6h', 6);
  await expect(clock).toContainText('Tue 5 Oct 2026');
  await expect(clock).toContainText('08:00');

  // Actions in a row are one entry of the calendar, cut at midnight.
  await openPage(page, 'Calendar');
  await expect(page.getByTitle('Sleep 00:00–08:00')).toBeVisible();
  await demoShot(page, 'merged-sleep');
  await page.getByRole('button', { name: 'Previous day' }).click();
  await expect(page.getByTitle('Think 21:30–00:00')).toBeVisible();

  // The days strip follows the game time on every page.
  const strip = page.getByRole('img', { name: /Oct 2026, / });
  for (const name of ['Balance', 'Profile', 'Game']) {
    await openPage(page, name);
    await expect(strip).toHaveAccessibleName('Tue 5 Oct 2026, 08:00');
  }
  await openPage(page, 'Profile');
  await expect(page.getByText('1.70 m')).toBeVisible();
  await expect(page.getByText('Played').locator('..')).toContainText('1 d');
  await demoShot(page, 'days-strip');
});
