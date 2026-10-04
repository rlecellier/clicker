import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');
});

test('the places menu unfolds and leads to the places', async ({ page }) => {
  await page.getByRole('button', { name: 'Menu' }).click();
  const places = page.getByRole('button', { name: /Places/ });
  await expect(places).toHaveAttribute('aria-expanded', 'false');

  await places.click();
  await expect(places).toHaveAttribute('aria-expanded', 'true');

  await page.getByRole('link', { name: /Work/ }).click();
  await expect(page).toHaveURL(/\/places\/work$/);
  await expect(page.getByRole('heading', { name: 'Work' })).toBeVisible();
  await expect(page.getByText('You are not here')).toBeVisible();
  // choosing a place closes the menu on mobile
  await expect(page.getByRole('complementary')).not.toBeInViewport();

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: /Home/ }).click();
  await expect(page.getByText('You are here', { exact: true })).toBeVisible();
});

test('the menu closes with Escape and with its backdrop', async ({ page }) => {
  const menu = page.getByRole('button', { name: 'Menu' });
  const sidebar = page.getByRole('complementary');

  await menu.click();
  await expect(sidebar).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(sidebar).not.toBeInViewport();

  await menu.click();
  await expect(sidebar).toBeInViewport();
  // the backdrop covers what the sidebar leaves free
  await page.mouse.click(470, 300);
  await expect(sidebar).not.toBeInViewport();
});

test('the menu leads to the balance and back to the game', async ({ page }) => {
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Balance' }).click();
  await expect(page.getByRole('heading', { name: 'Balance' })).toBeVisible();
  await expect(page.getByRole('complementary')).not.toBeInViewport();

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Game' }).click();
  await expect(page.getByRole('button', { name: /Eat a snack/ })).toBeVisible();
});

test('an unknown page offers a way back to the game', async ({ page }) => {
  await page.goto('/places/nowhere');
  await expect(page.getByRole('heading', { name: /404/ })).toBeVisible();

  await page.getByRole('link', { name: 'Back to the game' }).click();
  await expect(page.getByRole('button', { name: /Eat a snack/ })).toBeVisible();
});
