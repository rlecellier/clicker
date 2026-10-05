import { expect, test } from '@playwright/test';

test('the sidebar is always shown on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.clock.setFixedTime(new Date(2026, 9, 5, 7, 0));
  await page.goto('/');

  await expect(page.getByRole('complementary')).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
  await expect(page.getByRole('meter', { name: 'Calories' })).toBeVisible();
});
