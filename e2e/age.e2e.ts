import { expect, test } from '@playwright/test';

// The game runs eight times faster than real time by default.
const HOUR_MS = 1000 / 8;
const HOURS_PER_YEAR = 365 * 24;

test('the header shows the age, 18 at the start and one more each year', async ({
  page,
}) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  const header = page.getByRole('banner');
  await expect(header.getByText('18 yo')).toBeVisible();
  await expect(header.getByText(/\$/)).toBeHidden();

  await page.clock.fastForward((HOURS_PER_YEAR - 1) * HOUR_MS);
  await expect(header.getByText('18 yo')).toBeVisible();

  await page.clock.fastForward(2 * HOUR_MS);
  await expect(header.getByText('19 yo')).toBeVisible();
});
