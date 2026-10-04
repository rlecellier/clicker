import { expect, test } from '@playwright/test';

test('on mobile, the calendar page shows one day and swipes to the next', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 800 },
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('/calendar');
  await expect(page.getByRole('list')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(
    'Mon 1 Feb 2027',
  );

  // Playwright has no swipe gesture: the touch events are sent by hand.
  const grid = page.getByRole('list').locator('..').locator('..');
  await grid.dispatchEvent('touchstart', {
    touches: [{ identifier: 0, clientX: 300, clientY: 300 }],
  });
  await grid.dispatchEvent('touchend', {
    changedTouches: [{ identifier: 0, clientX: 100, clientY: 300 }],
  });
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(
    'Tue 2 Feb 2027',
  );
  await context.close();
});

test('on desktop, the calendar page shows the week and can show a day', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/calendar');
  await expect(page.getByRole('list')).toHaveCount(7);

  await page.getByRole('button', { name: 'Day', exact: true }).click();
  await expect(page.getByRole('list')).toHaveCount(1);

  await page.getByRole('button', { name: 'Week', exact: true }).click();
  await expect(page.getByRole('list')).toHaveCount(7);
});
