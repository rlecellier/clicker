import { expect, test } from '@playwright/test';

import { demoShot } from './support';

test('the profile page shows the body of a new player', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Profile' }).click();

  await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  await expect(page.getByText('1.70 m')).toBeVisible();
  await expect(page.getByText('70.0 kg')).toBeVisible();
  await expect(
    page.getByRole('main').getByRole('meter', { name: 'Brain' }),
  ).toBeVisible();
  await expect(
    page.getByRole('main').getByRole('slider', { name: 'Body fat' }),
  ).toBeVisible();
  await demoShot(page, 'profile-brain');
});

test('the cash is shown in the sidebar, on the game page and in the profile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  // Sidebar and game page.
  await expect(page.getByText('$0', { exact: true })).toHaveCount(2);

  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page.getByText('Cash').locator('..')).toContainText('$0');
});
