import { expect, test } from '@playwright/test';

import { addEvent, demoShot } from './support';

// The game runs eight times faster than real time by default.
const HOUR_MS = 1000 / 8;

test('an ask event stops the game until the player does it or skips it', async ({
  page,
}) => {
  // The first book of the library is drawn: Animal Farm, six hours.
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/calendar');
  await addEvent(page, { from: '20:00', to: '23:00', asks: true });
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Game' }).click();

  // the dialog is modal: the page behind it is hidden from the accessibility
  // tree, so the time is read from the attribute
  const time = page.locator('[role="img"]');
  const dialog = page.getByRole('dialog', { name: 'Read a book' });

  // Monday 20:00: the game stops and asks, however long the player waits.
  await page.clock.fastForward(21 * HOUR_MS);
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('20:00 – 23:00');
  await demoShot(page, 'ask-event');
  await expect(time).toHaveAttribute('aria-label', 'Mon, 20:00');
  await page.clock.fastForward(5 * HOUR_MS);
  await expect(time).toHaveAttribute('aria-label', 'Mon, 20:00');

  // Doing it lets the three hours of reading run.
  await page.getByRole('button', { name: 'Do it' }).click();
  await expect(dialog).toHaveCount(0);
  await page.clock.fastForward(3 * HOUR_MS);
  await expect(time).toHaveAttribute('aria-label', 'Mon, 23:00');
  await expect(page.getByText('3 / 6 h')).toBeVisible();

  // Tuesday 20:00: it asks again, and skipping leaves the book where it is.
  await page.clock.fastForward(21 * HOUR_MS);
  await expect(dialog).toBeVisible();
  await expect(time).toHaveAttribute('aria-label', 'Tue, 20:00');
  await page.getByRole('button', { name: 'Skip' }).click();
  await expect(dialog).toHaveCount(0);
  await page.clock.fastForward(3 * HOUR_MS);
  await expect(time).toHaveAttribute('aria-label', 'Tue, 23:00');
  await expect(page.getByText('3 / 6 h')).toBeVisible();
});
