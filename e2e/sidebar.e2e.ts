import { expect, test } from '@playwright/test';

test('the sidebar is always shown on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.clock.setFixedTime(new Date(2026, 9, 5, 7, 0));
  await page.goto('/');

  await expect(page.getByRole('complementary')).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
  await expect(page.getByRole('meter', { name: 'Calories' })).toBeVisible();
});

test('the folded sidebar keeps the menu icons on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 700 });
  await page.clock.setFixedTime(new Date(2026, 9, 5, 7, 0));
  await page.goto('/');

  // folded: the icons are there, the gauges are not
  await expect(
    page.getByRole('meter', { name: 'Calories' }),
  ).not.toBeInViewport();
  await expect(page.getByRole('link', { name: 'Balance' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Work/ })).toBeVisible();

  await page.getByRole('link', { name: 'Balance' }).click();
  await expect(page.getByRole('heading', { name: 'Balance' })).toBeVisible();
});
