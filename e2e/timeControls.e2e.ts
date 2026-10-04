import { expect, test } from '@playwright/test';

test('the debug buttons speed up and slow down the time', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  const calendar = page.getByRole('img');
  const speed = page.getByLabel('Time speed');
  await expect(speed).toHaveText('×8');

  await page.getByRole('button', { name: 'Speed up time' }).click();
  await page.getByRole('button', { name: 'Speed up time' }).click();
  await expect(speed).toHaveText('×32');

  // One second at ×32: thirty-two hours, so Tuesday 08:00.
  await page.clock.fastForward(1000);
  await expect(calendar).toHaveAccessibleName('Tue, 08:00');
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Slow down time' }).click();
  await page.getByRole('button', { name: 'Slow down time' }).click();
  await page.getByRole('button', { name: 'Slow down time' }).click();
  await expect(speed).toHaveText('×4');

  // Four seconds at ×4: sixteen more hours.
  await page.clock.fastForward(4000);
  await expect(calendar).toHaveAccessibleName('Wed, 00:00');
});
