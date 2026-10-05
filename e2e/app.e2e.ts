import { expect, test } from '@playwright/test';

import { elapse, getAJob, openPage, perform, startGame } from './support';

// On mobile: the menu, the places page, then the save and the restart.
test('navigate the menu, resume a saved game and restart it', async ({
  page,
}) => {
  await startGame(page);
  const menu = page.getByRole('button', { name: 'Menu' });
  const sidebar = page.getByRole('meter', { name: 'Calories' });
  const clock = page.getByRole('timer', { name: 'Game time' });
  const lookForAJob = page.getByRole('button', { name: /Look for a job/ });

  // Folded on mobile: the menu icons are there, the gauges are not.
  await expect(sidebar).not.toBeInViewport();
  await expect(page.getByRole('link', { name: 'Balance' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Places' })).toBeVisible();

  // The places page has a button per place; choosing one closes the menu.
  await openPage(page, 'Places');
  await expect(page).toHaveURL(/\/places$/);
  await expect(page.getByRole('heading', { name: 'Places' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Home.*You are here/ }),
  ).toBeVisible();
  await page.getByRole('link', { name: /Work/ }).click();
  await expect(page).toHaveURL(/\/places\/work$/);
  await expect(page.getByText('You are not here')).toBeVisible();
  await expect(sidebar).not.toBeInViewport();
  await openPage(page, 'Places');
  await page.getByRole('link', { name: /Home/ }).click();
  await expect(page.getByText('You are here', { exact: true })).toBeVisible();

  // The menu closes with Escape and with its backdrop.
  await menu.click();
  await expect(sidebar).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(sidebar).not.toBeInViewport();
  await menu.click();
  await page.mouse.click(470, 300);
  await expect(sidebar).not.toBeInViewport();

  // The balance, the title, and a page that does not exist.
  await menu.click();
  await page.getByRole('link', { name: 'Balance' }).click();
  await expect(page.getByRole('heading', { name: 'Balance' })).toBeVisible();
  await page.getByRole('link', { name: 'Clicker' }).click();
  await expect(lookForAJob).toBeVisible();
  await page.goto('/places/nowhere');
  await expect(page.getByRole('heading', { name: /404/ })).toBeVisible();
  await page.getByRole('link', { name: 'Back to the game' }).click();
  await expect(lookForAJob).toBeVisible();

  // The game is saved and resumed when the page is reloaded.
  await perform(page, /Have breakfast/, 0.5);
  await getAJob(page);
  await page.getByRole('button', { name: 'Go to work' }).click();
  await expect(clock).toContainText('08:30');
  await page.reload();
  await expect(clock).toContainText('08:30');
  await expect(page.getByRole('meter', { name: 'Fridge' })).toHaveAttribute(
    'aria-valuetext',
    '9 / 10',
  );
  await expect(page.getByRole('button', { name: 'Go home' })).toBeVisible();

  // An action that is not over is not saved: the game resumes before it.
  await page.getByRole('button', { name: 'Go home' }).click();
  await page.getByRole('button', { name: /Sleep 8h/ }).click();
  await elapse(page, 3);
  await page.reload();
  await expect(clock).toContainText('08:30');
  await expect(
    page.getByRole('meter', { name: 'Action in progress' }),
  ).toBeHidden();

  // Restart Game starts a new game, which is the one saved.
  await menu.click();
  await page.getByRole('button', { name: 'Restart Game' }).click();
  await expect(clock).toContainText('07:00');
  await expect(lookForAJob).toBeVisible();
  await page.reload();
  await expect(clock).toContainText('07:00');
  await expect(lookForAJob).toBeVisible();

  // A broken save is ignored and a new game starts.
  await perform(page, /Have breakfast/, 0.5);
  await page.evaluate(() => {
    localStorage.setItem('clicker.save', '{"version":1,"state":{"oops":true}}');
  });
  await page.reload();
  await expect(clock).toContainText('07:00');

  // No page scrolls sideways on a narrow phone.
  await page.setViewportSize({ width: 360, height: 700 });
  for (const path of ['/', '/calendar', '/balance', '/profile', '/places']) {
    await page.goto(path);
    const overflow = await page.evaluate(() =>
      [...document.querySelectorAll('header, aside, main')].some(
        (element) => element.scrollWidth > element.clientWidth,
      ),
    );
    expect(overflow, path).toBe(false);
  }
});
