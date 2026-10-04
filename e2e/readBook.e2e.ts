import { expect, test } from '@playwright/test';

test('reading a book moves on during free time and shows in achievements', async ({
  page,
}) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  const book = page.getByRole('meter', { name: 'Book' });
  await expect(book).toHaveAttribute('aria-valuetext', '0%');

  await page.getByRole('button', { name: /Read a book/ }).click();
  await expect(
    page.getByRole('button', { name: 'Stop reading' }),
  ).toBeVisible();

  // Three seconds at ×8: Tuesday 00:00. Of the day, only 07:30 to 08:00,
  // 18:00 to 19:00 and 20:00 to 23:00 are free: four hours and a half.
  await page.clock.fastForward(3000);
  await expect(page.getByRole('img')).toHaveAccessibleName('Tue, 00:00');
  await expect(book).toHaveAttribute('aria-valuetext', '9%');
  await expect(page.getByText('4 / 48 h')).toBeVisible();

  // Stopping freezes the book.
  await page.getByRole('button', { name: 'Stop reading' }).click();
  await page.clock.fastForward(1000);
  await expect(page.getByText('4 / 48 h')).toBeVisible();
  await expect(page.getByRole('button', { name: /Read a book/ })).toBeVisible();

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Achievements' }).click();
  await expect(
    page.getByRole('heading', { name: 'Achievements' }),
  ).toBeVisible();
  await expect(page.getByRole('meter', { name: 'Book' })).toHaveAttribute(
    'aria-valuetext',
    '9%',
  );
});
