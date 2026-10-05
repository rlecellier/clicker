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

test('a working morning: every click is half an hour of work, paid as the time goes by', async ({
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
  // At work: no eating at home, reading or sleeping.
  await expect(page.getByRole('button', { name: /Have lunch/ })).toHaveCount(0);

  // The player starts with 20 coins; the pay comes in as the hours go by.
  await expect(coins(page)).toHaveText('20');
  await page.getByRole('button', { name: /^Work/ }).click();
  await expect(coins(page)).toHaveText('20');
  // Leaving is not possible while working.
  await expect(page.getByRole('button', { name: 'Go home' })).toBeDisabled();
  await elapse(page, 0.5);
  await expect(clock).toContainText('08:30');
  await expect(coins(page)).toHaveText('25');
  await perform(page, /^Work/, 0.5);
  await expect(clock).toContainText('09:00');
  await expect(coins(page)).toHaveText('30');
  await demoShot(page, 'working');

  // Six more clicks finish the morning shift.
  for (let click = 0; click < 6; click += 1) {
    await perform(page, /^Work/, 0.5);
  }
  await expect(clock).toContainText('12:00');
  await expect(coins(page)).toHaveText('60');
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

test('the player stays where they are until they leave, so lunch at work is eaten out', async ({
  page,
}) => {
  await startGame(page);
  await getAJob(page);
  await page.getByRole('button', { name: 'Go to work' }).click();
  for (let click = 0; click < 8; click += 1) {
    await perform(page, /^Work/, 0.5);
  }

  // Noon is the lunch break: still at work, with nothing to work on yet.
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(clock).toContainText('12:00');
  await expect(page.locator('[data-location]')).toHaveAttribute(
    'data-location',
    'work',
  );
  const work = page.getByRole('button', { name: /^Work/ });
  await expect(work).toBeDisabled();
  await expect(work).toContainText('Not your working hours');
  // The fridge is at home: at work, lunch is paid for.
  await expect(page.getByRole('meter', { name: 'Fridge' })).toHaveAttribute(
    'aria-valuetext',
    '10 / 10',
  );
  const eatOut = page.getByRole('button', { name: 'Eat out' });
  await expect(eatOut).toContainText('8 coins');
  await perform(page, 'Eat out', 1);
  await expect(clock).toContainText('13:00');
  await expect(coins(page)).toHaveText('52');
  await expect(page.getByRole('meter', { name: 'Fridge' })).toHaveAttribute(
    'aria-valuetext',
    '10 / 10',
  );
  await demoShot(page, 'eat-out');

  // After lunch the afternoon shift can be worked, without moving.
  await perform(page, /^Work/, 0.5);
  await expect(clock).toContainText('13:30');
  await expect(coins(page)).toHaveText('57');

  // Leaving work in the middle of the shift is possible, and costs no time.
  await page.getByRole('button', { name: 'Go home' }).click();
  await expect(page.locator('[data-location]')).toHaveAttribute(
    'data-location',
    'home',
  );
  await expect(clock).toContainText('13:30');
  // At home, lunch comes from the fridge.
  await expect(page.getByRole('button', { name: /Have lunch/ })).toBeEnabled();

  // Sleeping the night away: the evening has no shift left.
  await perform(page, /Sleep 8h/, 8);
  await page.getByRole('button', { name: 'Go to work' }).click();
  await expect(work).toBeDisabled();
});

test('no meal out without the coins for it, and thinking is possible at work too', async ({
  page,
}) => {
  await startGame(page);
  await getAJob(page);
  await page.getByRole('button', { name: 'Go to work' }).click();
  // Eat out twice: 20 coins are not enough for a third.
  await perform(page, 'Eat out', 1);
  await perform(page, 'Eat out', 1);
  await expect(coins(page)).toHaveText('4');
  await expect(page.getByRole('button', { name: 'Eat out' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Eat out' })).toContainText(
    'Not enough coins',
  );

  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(clock).toContainText('10:00');
  await perform(page, 'Think 1h', 1);
  await expect(clock).toContainText('11:00');
  await expect(page.locator('[data-location]')).toHaveAttribute(
    'data-location',
    'work',
  );
});
