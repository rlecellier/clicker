import type { Page } from '@playwright/test';

// Monday 5 October 2026, 07:00: the player's date and time when the game starts.
export const MONDAY_MORNING = new Date(2026, 9, 5, 7, 0);

// Opens the site at the given moment of the player's clock, without starting
// a game. The browser clock is paused: the game only runs when `elapse` lets
// time go by.
export const openSite = async (page: Page, now = MONDAY_MORNING) => {
  await page.clock.install({ time: new Date(now.getTime() - 1000) });
  await page.clock.pauseAt(now);
  await page.goto('/');
};

// Goes through the start screens: New Game, then Start the game.
export const startNewGame = async (page: Page) => {
  await page.getByRole('button', { name: 'New Game' }).click();
  await page.getByRole('button', { name: 'Start the game' }).click();
};

// Opens a new game, launched at the given moment of the player's clock.
export const startGame = async (page: Page, now = MONDAY_MORNING) => {
  await openSite(page, now);
  await startNewGame(page);
};

// Lets game hours go by, at one game hour per second, plus a margin for the
// frame that starts the action: an action that lasts that many hours is over.
// In the middle of an action the time is only known to within the margin.
export const elapse = async (page: Page, hours: number) => {
  await page.clock.runFor(hours * 1000 + 300);
};

// Opens a page of the menu (the menu is closed on mobile).
export const openPage = async (page: Page, name: string) => {
  const menu = page.getByRole('button', { name: 'Menu' });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('link', { name, exact: true }).click();
};

// Does an action from the buttons, and lets the hours it takes go by.
export const perform = async (
  page: Page,
  name: string | RegExp,
  hours: number,
) => {
  await page.getByRole('button', { name }).click();
  await elapse(page, hours);
};
