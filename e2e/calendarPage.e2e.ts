import { expect, test } from '@playwright/test';

import { openPage, perform, startGame } from './support';

test('on mobile, the calendar page shows one day and swipes to the next', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 800 },
    hasTouch: true,
  });
  const page = await context.newPage();
  await startGame(page);
  await openPage(page, 'Calendar');
  await expect(page.getByRole('list')).toHaveCount(1);
  const title = page.getByRole('heading', { level: 2 });
  await expect(title).toHaveText('Mon 1 Oct 2026');
  // On the current day: there is nothing to come back to.
  await expect(page.getByRole('button', { name: 'Today' })).toBeDisabled();

  // Playwright has no swipe gesture: the touch events are sent by hand.
  const grid = page.getByRole('list').locator('..').locator('..');
  await grid.dispatchEvent('touchstart', {
    touches: [{ identifier: 0, clientX: 300, clientY: 300 }],
  });
  await grid.dispatchEvent('touchend', {
    changedTouches: [{ identifier: 0, clientX: 100, clientY: 300 }],
  });
  await expect(title).toHaveText('Tue 2 Oct 2026');

  await page.getByRole('button', { name: 'Today' }).click();
  await expect(title).toHaveText('Mon 1 Oct 2026');
  await context.close();
});

test('on desktop, the calendar page shows the week and can show a day', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await startGame(page);
  await openPage(page, 'Calendar');
  const title = page.getByRole('heading', { level: 2 });
  await expect(page.getByRole('list')).toHaveCount(7);

  // The game began on the Monday of this week: nothing before it.
  await expect(
    page.getByRole('button', { name: 'Previous week' }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Next week' }).click();
  await expect(title).toHaveText('1 – 7 Nov 2026');
  await page.getByRole('button', { name: 'Previous week' }).click();
  await expect(title).toHaveText('1 – 7 Oct 2026');

  await page.getByRole('button', { name: 'Day', exact: true }).click();
  await expect(page.getByRole('list')).toHaveCount(1);
  await page.getByRole('button', { name: 'Next day' }).click();
  await expect(title).toHaveText('Tue 2 Oct 2026');
  await page.getByRole('button', { name: 'Today' }).click();
  await expect(title).toHaveText('Mon 1 Oct 2026');

  await page.getByRole('button', { name: 'Week', exact: true }).click();
  await expect(page.getByRole('list')).toHaveCount(7);
});

test('the whole day fits the screen, and ctrl + wheel zooms in on the hours', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await startGame(page);
  await perform(page, /Have lunch/, 1);
  await page.goto('/calendar');
  const grid = page.getByRole('list').first().locator('..').locator('..');
  const fits = await grid.evaluate(
    (element) => element.scrollHeight <= element.clientHeight,
  );
  expect(fits).toBe(true);

  // the event under the mouse grows and stays under it
  const lunch = page.getByTitle(/^Lunch/).first();
  const before = (await lunch.boundingBox())!;
  await page.mouse.move(before.x + 5, before.y);
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, -100);
  await page.keyboard.up('Control');
  await expect
    .poll(async () => (await lunch.boundingBox())!.height)
    .toBeGreaterThan(before.height * 2);
  const after = (await lunch.boundingBox())!;
  expect(Math.abs(after.y - before.y)).toBeLessThan(5);
});

test('on mobile, a pinch zooms in without changing the day', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 800 },
    hasTouch: true,
  });
  const page = await context.newPage();
  await startGame(page);
  await perform(page, /Have lunch/, 1);
  await page.goto('/calendar');
  const lunch = page.getByTitle(/^Lunch/);
  // the event has no box until the grid is laid out
  await expect.poll(() => lunch.boundingBox()).not.toBeNull();
  const before = (await lunch.boundingBox())!;

  // Playwright has no pinch gesture: two fingers are moved apart by hand.
  const cdp = await context.newCDPSession(page);
  const fingers = (gap: number) => [
    { x: 200, y: before.y - gap },
    { x: 200, y: before.y + gap },
  ];
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: fingers(20),
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: fingers(60),
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });

  await expect
    .poll(async () => (await lunch.boundingBox())!.height)
    .toBeGreaterThan(before.height * 2);
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(
    'Mon 1 Oct 2026',
  );
  await context.close();
});
