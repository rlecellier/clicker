import { expect, test } from '@playwright/test';

import { demoShot, elapse, openPage, perform, startGame } from './support';

test('time runs while an action is in progress, at one game hour per second', async ({
  page,
}) => {
  await startGame(page);
  const clock = page.getByRole('timer', { name: 'Game time' });
  const progress = page.getByRole('meter', { name: 'Action in progress' });
  await expect(progress).toBeHidden();

  await page.getByRole('button', { name: /Sleep 4h/ }).click();
  // The time does not jump: it has not moved yet.
  await expect(clock).toContainText('07:00');
  await expect(progress).toHaveAttribute('aria-valuetext', 'Sleep, 0%');

  // One game hour per second: after two seconds, about two hours have gone by.
  await elapse(page, 2);
  await expect(clock).toContainText(/09:[0-2]\d/);
  await expect(progress).toHaveAttribute('aria-valuetext', /Sleep, (5|6)\d%/);
  await demoShot(page, 'time-running');

  // One action at a time: nothing else can be started meanwhile.
  await expect(page.getByRole('button', { name: /Sleep 2h/ })).toBeDisabled();
  await expect(page.getByRole('button', { name: /Sleep 2h/ })).toHaveAttribute(
    'title',
    'Busy',
  );

  await elapse(page, 2);
  await expect(clock).toContainText('11:00');
  await expect(progress).toBeHidden();
  await expect(page.getByRole('button', { name: /Sleep 2h/ })).toBeEnabled();
});

test('meals take the time they need and feed the calories gauge', async ({
  page,
}) => {
  await startGame(page);
  const calories = page.getByRole('meter', { name: 'Calories' });
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(calories).toHaveAttribute('aria-valuetext', '60%');

  // 15% of calories in half an hour, minus the burn of that half hour.
  await perform(page, /Have breakfast/, 0.5);
  await expect(clock).toContainText('07:30');
  await expect(calories).toHaveAttribute('aria-valuetext', '74%');
  await demoShot(page, 'breakfast');

  await perform(page, /Have lunch/, 1);
  await expect(clock).toContainText('08:30');
  await perform(page, /Have dinner/, 1);
  await expect(clock).toContainText('09:30');
  // Too much food is turned into fat.
  await openPage(page, 'Profile');
  await expect(page.getByText('Weight').locator('..')).not.toContainText(
    '70.0 kg',
  );
});

test('the carrot tells the calories state when clicked', async ({ page }) => {
  await startGame(page);
  const carrot = page.getByRole('button', { name: 'Calories status' });
  await expect(carrot).toHaveAttribute('data-status', 'good');

  // Three meals in a row are too much.
  await perform(page, /Have breakfast/, 0.5);
  await perform(page, /Have lunch/, 1);
  await perform(page, /Have dinner/, 1);
  await expect(carrot).toHaveAttribute('data-status', 'overflowing');
  await carrot.click();
  await expect(page.getByText('Too much energy')).toBeVisible();
});

test('meals at home empty the fridge and shopping fills it again', async ({
  page,
}) => {
  await startGame(page);
  const fridge = page.getByRole('meter', { name: 'Fridge' });
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(fridge).toHaveAttribute('aria-valuetext', '10 / 10');
  // Nothing to buy while the fridge is full.
  await expect(
    page.getByRole('button', { name: /Go shopping/ }),
  ).toBeDisabled();
  await expect(page.getByRole('button', { name: /Go shopping/ })).toContainText(
    'The fridge is full',
  );

  await perform(page, /Have breakfast/, 0.5);
  await expect(fridge).toHaveAttribute('aria-valuetext', '9 / 10');
  await perform(page, /Have lunch/, 1);
  await expect(fridge).toHaveAttribute('aria-valuetext', '8 / 10');

  // The shopping takes an hour and fills the fridge once it is over.
  await page.getByRole('button', { name: /Go shopping/ }).click();
  await expect(fridge).toHaveAttribute('aria-valuetext', '8 / 10');
  await elapse(page, 1);
  await expect(clock).toContainText('09:30');
  await expect(fridge).toHaveAttribute('aria-valuetext', '10 / 10');
  await demoShot(page, 'fridge');
});

test('thinking lets 30 minutes, 1 hour or 2 hours go by', async ({ page }) => {
  await startGame(page);
  const clock = page.getByRole('timer', { name: 'Game time' });

  await perform(page, 'Think 30 min', 0.5);
  await expect(clock).toContainText('07:30');
  await perform(page, 'Think 1h', 1);
  await expect(clock).toContainText('08:30');
  await perform(page, 'Think 2h', 2);
  await expect(clock).toContainText('10:30');

  // The three of them are one entry of the calendar.
  await openPage(page, 'Calendar');
  await expect(page.getByTitle(/^Think /)).toHaveCount(1);
  await expect(page.getByTitle('Think 07:00–10:30')).toBeVisible();
});

test('sleeping lasts 2, 4, 6 or 8 hours, and sleeps in a row are one entry of the calendar', async ({
  page,
}) => {
  await startGame(page);
  const clock = page.getByRole('timer', { name: 'Game time' });
  const brain = page.getByRole('meter', { name: 'Brain' });
  await expect(brain).toHaveAttribute('aria-valuetext', '20%');

  await perform(page, /Sleep 2h/, 2);
  await expect(clock).toContainText('09:00');
  await expect(brain).toHaveAttribute('aria-valuetext', '0%');
  await perform(page, /Sleep 4h/, 4);
  await expect(clock).toContainText('13:00');
  await perform(page, /Sleep 6h/, 6);
  await expect(clock).toContainText('19:00');
  await perform(page, /Sleep 8h/, 8);
  // Past midnight: Tuesday 03:00.
  await expect(clock).toContainText('Tue 2 Oct 2026');
  await expect(clock).toContainText('03:00');

  // 20 hours of sleep in a row: the calendar cuts them at midnight, Tuesday up
  // to 03:00 and, the day before, Monday from 07:00.
  await openPage(page, 'Calendar');
  await expect(page.getByTitle(/^Sleep /)).toHaveCount(1);
  await expect(page.getByTitle('Sleep 00:00–03:00')).toBeVisible();
  await demoShot(page, 'merged-sleep');
  await page.getByRole('button', { name: 'Previous day' }).click();
  await expect(page.getByTitle(/^Sleep /)).toHaveCount(1);
  await expect(page.getByTitle('Sleep 07:00–00:00')).toBeVisible();
});

test('reading draws a book, moves it on and lists it in achievements once read', async ({
  page,
}) => {
  // The first book of the library is drawn: Animal Farm, six hours.
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await startGame(page);
  const book = page.getByRole('meter', { name: 'Animal Farm' });
  await expect(book).toBeHidden();

  await perform(page, 'Read 1h', 1);
  await expect(page.getByRole('timer')).toContainText('08:00');
  await expect(book).toHaveAttribute('aria-valuetext', '16%');
  await perform(page, 'Read 2h', 2);
  await expect(page.getByRole('timer')).toContainText('10:00');
  await expect(book).toHaveAttribute('aria-valuetext', '50%');
  await expect(page.getByText('3 / 6 h')).toBeVisible();

  await openPage(page, 'Achievements');
  await expect(book).toHaveAttribute('aria-valuetext', '50%');
  await expect(page.getByText('No book read yet.')).toBeVisible();

  // Three more hours finish the book, which moves to the books read.
  await openPage(page, 'Game');
  await perform(page, 'Read 3h', 3);
  await openPage(page, 'Achievements');
  await expect(page.getByText('Books read (1)')).toBeVisible();
  await expect(page.getByText('George Orwell')).toBeVisible();
  await expect(page.getByText('No book on the go.')).toBeVisible();
});
