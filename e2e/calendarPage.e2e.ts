import { expect, test } from '@playwright/test';

test('on mobile, the calendar page shows one day and swipes to the next', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 800 },
    hasTouch: true,
  });
  const page = await context.newPage();
  // Paused, so that the current day does not change under the test.
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/');

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Calendar' }).click();
  await expect(page.getByRole('list')).toHaveCount(1);
  const title = page.getByRole('heading', { level: 2 });
  await expect(title).toHaveText('Mon 1 Feb 2027');
  const today = page.getByRole('button', { name: 'Today' });
  await expect(today).toBeDisabled();

  // Playwright has no swipe gesture: the touch events are sent by hand.
  const grid = page.getByRole('list').locator('..').locator('..');
  await grid.dispatchEvent('touchstart', {
    touches: [{ identifier: 0, clientX: 300, clientY: 300 }],
  });
  await grid.dispatchEvent('touchend', {
    changedTouches: [{ identifier: 0, clientX: 100, clientY: 300 }],
  });
  await expect(title).toHaveText('Tue 2 Feb 2027');

  await today.click();
  await expect(title).toHaveText('Mon 1 Feb 2027');
  await context.close();
});

test('on desktop, the calendar page shows the week and can show a day', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto('/calendar');
  const title = page.getByRole('heading', { level: 2 });
  await expect(page.getByRole('list')).toHaveCount(7);
  await expect(
    page.getByRole('button', { name: 'Previous week' }),
  ).toBeDisabled();

  await page.getByRole('button', { name: 'Next week' }).click();
  await expect(title).toHaveText('8 – 14 Feb 2027');
  await page.getByRole('button', { name: 'Previous week' }).click();
  await expect(title).toHaveText('1 – 7 Feb 2027');

  await page.getByRole('button', { name: 'Day', exact: true }).click();
  await expect(page.getByRole('list')).toHaveCount(1);
  await page.getByRole('button', { name: 'Next day' }).click();
  await expect(title).toHaveText('Tue 2 Feb 2027');
  await page.getByRole('button', { name: 'Today' }).click();
  await expect(title).toHaveText('Mon 1 Feb 2027');

  await page.getByRole('button', { name: 'Week', exact: true }).click();
  await expect(page.getByRole('list')).toHaveCount(7);
});
