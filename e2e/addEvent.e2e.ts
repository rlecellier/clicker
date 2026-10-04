import { expect, test } from '@playwright/test';

import { addEvent, demoShot } from './support';

test('an event that overlaps the plan cannot be added', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/calendar');

  await page.getByRole('button', { name: 'Add event' }).click();
  await expect(page.getByRole('dialog', { name: 'Add event' })).toBeVisible();

  // Lunch runs from 12:00 to 13:00.
  await page.getByLabel('From', { exact: true }).fill('12:30');
  await page.getByLabel('To', { exact: true }).fill('14:00');
  await expect(page.getByRole('alert')).toContainText('overlaps');
  await demoShot(page, 'add-event');
  await expect(
    page.getByRole('button', { name: 'Add to my plan' }),
  ).toBeDisabled();

  await page.getByLabel('To', { exact: true }).fill('12:15');
  await expect(page.getByRole('alert')).toContainText('half hour');

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('an event can happen once, on the day shown', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/calendar');
  await expect(page.getByRole('list')).toHaveCount(1);

  await addEvent(page, {
    from: '15:00',
    to: '16:00',
    repeat: 'Does not repeat (Mon 1)',
  });
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Read a book' }),
  ).toHaveCount(1);

  // Tomorrow has no such event.
  await page.getByRole('button', { name: 'Pause' }).click();
  await page.getByRole('button', { name: 'Next day' }).click();
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Read a book' }),
  ).toHaveCount(0);
});
