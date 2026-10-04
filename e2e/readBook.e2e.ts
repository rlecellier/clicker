import { expect, test } from '@playwright/test';

test('reading a book moves on during free time and shows in achievements', async ({
  page,
}) => {
  // The first book of the library is drawn: Animal Farm, six hours.
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  const book = page.getByRole('meter', { name: 'Animal Farm' });
  await expect(book).toBeHidden();

  await page.getByRole('button', { name: 'Read a book' }).click();
  await expect(book).toHaveAttribute('aria-valuetext', '0%');
  await expect(
    page.getByRole('button', { name: 'Stop reading' }),
  ).toBeVisible();

  // Three seconds at ×8: Tuesday 00:00. Of the day, only 07:30 to 08:00,
  // 18:00 to 19:00 and 20:00 to 23:00 are free: four hours and a half.
  await page.clock.fastForward(3000);
  await expect(page.getByRole('img')).toHaveAccessibleName('Tue, 00:00');
  await expect(book).toHaveAttribute('aria-valuetext', '75%');
  await expect(page.getByText('4 / 6 h')).toBeVisible();

  // Stopping freezes the book.
  await page.getByRole('button', { name: 'Stop reading' }).click();
  await page.clock.fastForward(1000);
  await expect(page.getByText('4 / 6 h')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Resume reading' }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Achievements' }).click();
  await expect(
    page.getByRole('heading', { name: 'Achievements' }),
  ).toBeVisible();
  await expect(
    page.getByRole('meter', { name: 'Animal Farm' }),
  ).toHaveAttribute('aria-valuetext', '75%');
  await expect(page.getByText('No book read yet.')).toBeVisible();

  // Back on the game, resuming finishes the book (two hours left, free time
  // on the weekend) and it moves to the books read.
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Game' }).click();
  await page.getByRole('button', { name: 'Resume reading' }).click();
  await page.clock.fastForward(5000);
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Achievements' }).click();
  await expect(page.getByText('Books read (1)')).toBeVisible();
  await expect(page.getByText('George Orwell')).toBeVisible();
  await expect(page.getByText('No book on the go.')).toBeVisible();
});
