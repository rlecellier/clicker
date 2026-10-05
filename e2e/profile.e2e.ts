import { expect, test } from '@playwright/test';

import { demoShot, openPage, startGame } from './support';

test('the profile page shows the body of a new player', async ({ page }) => {
  await startGame(page);
  await openPage(page, 'Profile');

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

test('the gold coins are shown in the header and in the profile', async ({
  page,
}) => {
  await startGame(page);
  await expect(page.getByRole('status', { name: 'Gold coins' })).toHaveText(
    '0',
  );
  await demoShot(page, 'age-and-coins');
  await openPage(page, 'Profile');
  await expect(page.getByText('Gold coins').locator('..')).toContainText('0');
});

test('the profile shows the age, the birth date and the time played', async ({
  page,
}) => {
  // The birthday is the day the game is launched.
  await startGame(page, new Date(2026, 9, 4, 12));
  await openPage(page, 'Profile');
  await expect(page.getByText('Age').locator('..')).toContainText('18 years');
  await expect(page.getByText('Born').locator('..')).toContainText(
    '4 October 2008',
  );
  await expect(page.getByText('Played').locator('..')).toContainText('0 d');

  // Eight hours of sleep are played.
  await openPage(page, 'Game');
  await page.getByRole('button', { name: /Sleep 8h/ }).click();
  await page.getByRole('button', { name: /Sleep 8h/ }).click();
  await page.getByRole('button', { name: /Sleep 8h/ }).click();
  await openPage(page, 'Profile');
  await expect(page.getByText('Played').locator('..')).toContainText('1 d');
  await demoShot(page, 'profile-life');
});
