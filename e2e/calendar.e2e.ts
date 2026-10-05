import { expect, test } from '@playwright/test';

import { openPage, perform, startGame } from './support';

test('on desktop: the sidebar stays, the calendar shows a week or a day and zooms', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await startGame(page);
  await expect(page.getByRole('meter', { name: 'Calories' })).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();

  await perform(page, /Have a meal/, 1);
  await openPage(page, 'Calendar');
  const title = page.getByRole('heading', { level: 2 });
  await expect(page.getByRole('main').getByRole('list')).toHaveCount(7);

  // The whole day fits the screen; ctrl + wheel zooms in on the hours, and the
  // event under the mouse grows and stays under it.
  const grid = page
    .getByRole('main')
    .getByRole('list')
    .first()
    .locator('..')
    .locator('..');
  expect(
    await grid.evaluate(
      (element) => element.scrollHeight <= element.clientHeight,
    ),
  ).toBe(true);
  const lunch = page.getByTitle(/^Meal/).first();
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

  // Nothing before the week the game began; weeks and days can be browsed.
  await expect(
    page.getByRole('button', { name: 'Previous week' }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Next week' }).click();
  await expect(title).toHaveText('1 – 28 Nov 2026');
  await page.getByRole('button', { name: 'Previous week' }).click();
  await page.getByRole('button', { name: 'Day', exact: true }).click();
  await expect(page.getByRole('main').getByRole('list')).toHaveCount(1);
  await page.getByRole('button', { name: 'Next day' }).click();
  await expect(title).toHaveText('Tue 5 Oct 2026');
  await page.getByRole('button', { name: 'Today' }).click();
  await expect(title).toHaveText('Mon 1 Oct 2026');
  await page.getByRole('button', { name: 'Week', exact: true }).click();
  await expect(page.getByRole('main').getByRole('list')).toHaveCount(7);
});

test('on mobile: the calendar shows one day, swipes to the next and pinches to zoom', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 800 },
    hasTouch: true,
  });
  const page = await context.newPage();
  await startGame(page);
  await perform(page, /Have a meal/, 1);
  await openPage(page, 'Calendar');
  await expect(page.getByRole('main').getByRole('list')).toHaveCount(1);
  const title = page.getByRole('heading', { level: 2 });
  await expect(title).toHaveText('Mon 1 Oct 2026');
  await expect(page.getByRole('button', { name: 'Today' })).toBeDisabled();

  // Playwright has no swipe gesture: the touch events are sent by hand.
  const grid = page
    .getByRole('main')
    .getByRole('list')
    .locator('..')
    .locator('..');
  await grid.dispatchEvent('touchstart', {
    touches: [{ identifier: 0, clientX: 300, clientY: 300 }],
  });
  await grid.dispatchEvent('touchend', {
    changedTouches: [{ identifier: 0, clientX: 100, clientY: 300 }],
  });
  await expect(title).toHaveText('Tue 5 Oct 2026');
  await page.getByRole('button', { name: 'Today' }).click();
  await expect(title).toHaveText('Mon 1 Oct 2026');

  // Nor a pinch: two fingers are moved apart by hand.
  const lunch = page.getByTitle(/^Meal/);
  await expect.poll(() => lunch.boundingBox()).not.toBeNull();
  const before = (await lunch.boundingBox())!;
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
  await expect(title).toHaveText('Mon 1 Oct 2026');
  await context.close();
});
