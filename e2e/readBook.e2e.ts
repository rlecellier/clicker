import { expect, test } from '@playwright/test';

import { addEvent } from './support';

test('reading events draw a book, read it and list it in achievements', async ({
  page,
}) => {
  // The first book of the library is drawn: Animal Farm, six hours.
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  // Nothing to read as long as no reading event is planned.
  const book = page.getByRole('meter', { name: 'Animal Farm' });
  await expect(book).toBeHidden();
  await expect(page.getByRole('button', { name: /Read a book/ })).toHaveCount(
    0,
  );

  // Reading every day from 20:00 to 23:00, started automatically.
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Calendar' }).click();
  await addEvent(page, { from: '20:00', to: '23:00' });
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Read a book' }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Game' }).click();

  // Three seconds at ×8: Tuesday 00:00, three hours of reading in the evening.
  await page.clock.fastForward(3000);
  await expect(page.getByRole('img')).toHaveAccessibleName('Tue, 00:00');
  await expect(book).toHaveAttribute('aria-valuetext', '50%');
  await expect(page.getByText('3 / 6 h')).toBeVisible();

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Achievements' }).click();
  await expect(
    page.getByRole('heading', { name: 'Achievements' }),
  ).toBeVisible();
  await expect(book).toHaveAttribute('aria-valuetext', '50%');
  await expect(page.getByText('No book read yet.')).toBeVisible();

  // Tuesday evening finishes the book, which moves to the books read.
  await page.clock.fastForward(3000);
  await expect(page.getByText('Books read (1)')).toBeVisible();
  await expect(page.getByText('George Orwell')).toBeVisible();
  await expect(page.getByText('No book on the go.')).toBeVisible();
});
