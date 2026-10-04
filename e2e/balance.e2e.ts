import { expect, test } from '@playwright/test';

// The game runs eight times faster than real time by default.
const HOUR_MS = 1000 / 8;

test('the sidebar is always shown on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  await expect(page.getByRole('complementary')).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
  await expect(page.getByRole('meter', { name: 'Calories' })).toBeVisible();
});

test('the balance page lists the rent and the meals the player paid', async ({
  page,
}) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  // A full day: breakfast, lunch and dinner are paid.
  await page.clock.fastForward(24 * HOUR_MS);
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Balance' }).click();

  await expect(page.getByRole('heading', { name: 'Balance' })).toBeVisible();
  await expect(page.getByRole('row', { name: /Breakfast/ })).toContainText(
    '$2.50',
  );
  await expect(page.getByRole('row', { name: /Total/ })).toContainText(
    '$18.50',
  );
});
