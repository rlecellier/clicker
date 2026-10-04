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

test('the profile shows the age, the birth date and the time played', async ({
  page,
}) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page.getByText('Age').locator('..')).toContainText('18 years');
  await expect(page.getByText('Born').locator('..')).toContainText(
    '1 February 2009',
  );
  await expect(page.getByText('Played').locator('..')).toContainText('0 d');

  // A year and three days later.
  await page.clock.fastForward((368 * 24 * 1000) / 8);
  await expect(page.getByText('Age').locator('..')).toContainText('19 years');
  await expect(page.getByText('Played').locator('..')).toContainText('1 y 3 d');
});
