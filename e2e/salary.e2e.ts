import { expect, test } from '@playwright/test';

// The game runs eight times faster than real time by default.
const HOUR_MS = 1000 / 8;
const HOURS_PER_WEEK = 7 * 24;

test('work events pay the salary, banked at the end of the week', async ({
  page,
}) => {
  // Paused, so that only the steps below make the game time move.
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  const money = page.getByText(/^\$\d/).first();
  const pending = page.getByText(/^\+\$/);
  await expect(money).toHaveText('$0');
  await expect(pending).toHaveText('+$0.00');

  // Monday morning, in the middle of the first work event.
  await page.clock.fastForward(10 * HOUR_MS);
  await expect(page.getByText(/earning/)).toBeVisible();
  await expect(pending).not.toHaveText('+$0.00');
  await page.waitForTimeout(500);

  // Monday over lunch: the pay holds.
  await page.clock.fastForward(2.5 * HOUR_MS);
  await expect(page.getByText('pay of the week')).toBeVisible();
  await page.waitForTimeout(500);

  // Friday evening: the whole week is earned, but not paid yet.
  await page.clock.fastForward((4 * 24 + 8) * HOUR_MS);
  await expect(pending).toHaveText('+$250.00');
  await expect(money).toHaveText('$0');
  await page.waitForTimeout(500);

  // Sunday night: the week is over and the pay lands in the bank.
  await page.clock.fastForward(
    (HOURS_PER_WEEK - 4 * 24 - 20.5) * HOUR_MS + 100,
  );
  await expect(money).toHaveText('$250');
  await expect(pending).toHaveText('+$0.00');
});
