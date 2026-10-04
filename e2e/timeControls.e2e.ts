import { expect, test } from '@playwright/test';

test('the debug buttons speed up and slow down the time', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  const calendar = page.getByRole('img');
  const speed = page.getByLabel('Time speed');
  await expect(speed).toHaveText('×1');

  await page.getByRole('button', { name: 'Speed up time' }).click();
  await page.getByRole('button', { name: 'Speed up time' }).click();
  await expect(speed).toHaveText('×4');

  // Four seconds at ×4: sixteen hours, so Monday 16:00.
  await page.clock.fastForward(4000);
  await expect(calendar).toHaveAccessibleName('Mon, 16:00');
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Slow down time' }).click();
  await page.getByRole('button', { name: 'Slow down time' }).click();
  await page.getByRole('button', { name: 'Slow down time' }).click();
  await expect(speed).toHaveText('×0.5');

  // Four seconds at ×0.5: two more hours.
  await page.clock.fastForward(4000);
  await expect(calendar).toHaveAccessibleName('Mon, 18:00');
});
