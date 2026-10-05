import { expect, test } from '@playwright/test';

import { demoShot, openPage, startGame } from './support';

test('meals take the time they need and feed the calories gauge', async ({
  page,
}) => {
  await startGame(page);
  const calories = page.getByRole('meter', { name: 'Calories' });
  const clock = page.getByRole('timer', { name: 'Game time' });
  await expect(calories).toHaveAttribute('aria-valuetext', '60%');

  // 15% of calories in half an hour, minus the burn of that half hour.
  await page.getByRole('button', { name: /Have breakfast/ }).click();
  await expect(clock).toContainText('07:30');
  await expect(calories).toHaveAttribute('aria-valuetext', '74%');
  await demoShot(page, 'breakfast');

  await page.getByRole('button', { name: /Have lunch/ }).click();
  await expect(clock).toContainText('08:30');
  await page.getByRole('button', { name: /Have dinner/ }).click();
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
  for (const meal of ['Have breakfast', 'Have lunch', 'Have dinner']) {
    await page.getByRole('button', { name: new RegExp(meal) }).click();
  }
  await expect(carrot).toHaveAttribute('data-status', 'overflowing');
  await carrot.click();
  await expect(page.getByText('Too much energy')).toBeVisible();
});

test('sleeping lasts 2, 4, 6 or 8 hours, and sleeps in a row are one entry of the calendar', async ({
  page,
}) => {
  await startGame(page);
  const clock = page.getByRole('timer', { name: 'Game time' });
  const brain = page.getByRole('meter', { name: 'Brain' });
  await expect(brain).toHaveAttribute('aria-valuetext', '20%');

  await page.getByRole('button', { name: /Sleep 2h/ }).click();
  await expect(clock).toContainText('09:00');
  await expect(brain).toHaveAttribute('aria-valuetext', '0%');
  await page.getByRole('button', { name: /Sleep 4h/ }).click();
  await expect(clock).toContainText('13:00');
  await page.getByRole('button', { name: /Sleep 6h/ }).click();
  await expect(clock).toContainText('19:00');
  await page.getByRole('button', { name: /Sleep 8h/ }).click();
  // Past midnight: Tuesday 03:00.
  await expect(clock).toContainText('Tue 6 Oct 2026');
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

  await page.getByRole('button', { name: /^Read/ }).click();
  await expect(page.getByRole('timer')).toContainText('08:00');
  await expect(book).toHaveAttribute('aria-valuetext', '16%');
  await page.getByRole('button', { name: /^Read/ }).click();
  await page.getByRole('button', { name: /^Read/ }).click();
  await expect(book).toHaveAttribute('aria-valuetext', '50%');
  await expect(page.getByText('3 / 6 h')).toBeVisible();

  await openPage(page, 'Achievements');
  await expect(book).toHaveAttribute('aria-valuetext', '50%');
  await expect(page.getByText('No book read yet.')).toBeVisible();

  // Three more hours finish the book, which moves to the books read.
  await openPage(page, 'Game');
  for (let hour = 0; hour < 3; hour += 1) {
    await page.getByRole('button', { name: /^Read/ }).click();
  }
  await openPage(page, 'Achievements');
  await expect(page.getByText('Books read (1)')).toBeVisible();
  await expect(page.getByText('George Orwell')).toBeVisible();
  await expect(page.getByText('No book on the go.')).toBeVisible();
});
