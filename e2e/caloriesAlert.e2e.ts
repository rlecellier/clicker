import { expect, test } from '@playwright/test';

test('the menu opens the calories sidebar on mobile', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  const menu = page.getByRole('button', { name: 'Menu' });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('complementary')).not.toBeInViewport();

  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('complementary')).toBeInViewport();
  await expect(page.getByText('Fat 0.0')).toBeVisible();

  await menu.click();
  await expect(page.getByRole('complementary')).not.toBeInViewport();
});

test('a bell tells what is wrong when the calories go out of range', async ({
  page,
}) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');
  const bell = page.getByRole('button', { name: 'Calories alert' });
  await expect(bell).toBeHidden();

  // 50% plus four snacks of 10% goes over 80%.
  for (let snack = 0; snack < 4; snack += 1) {
    await page.getByRole('button', { name: /Eat a snack/ }).click();
  }
  await bell.click();
  await expect(page.getByText('Calories too high')).toBeVisible();
});
