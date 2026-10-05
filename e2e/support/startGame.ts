import type { Page } from '@playwright/test';

// Sunday 4 October 2026, evening: the player's date and time when the game is launched, so it starts on Monday 5 October at 08:00.
export const SUNDAY_EVENING = new Date(2026, 9, 4, 20, 0);

// Opens the site at the given moment of the player's clock, without starting
// a game. The browser clock is paused: the game only runs when `elapse` lets
// time go by.
export const openSite = async (page: Page, now = SUNDAY_EVENING) => {
  await page.clock.install({ time: new Date(now.getTime() - 1000) });
  await page.clock.pauseAt(now);
  await page.goto('/');
};

// Goes through the start screens: New Game, who the player is, then Start the
// game.
export const startNewGame = async (page: Page) => {
  await page.getByRole('button', { name: 'New Game' }).click();
  await page.getByRole('button', { name: 'A boy' }).click();
  await page.getByRole('button', { name: 'Start the game' }).click();
};

// Opens a new game, launched at the given moment of the player's clock.
export const startGame = async (page: Page, now = SUNDAY_EVENING) => {
  await openSite(page, now);
  await startNewGame(page);
};

// Lets game hours go by, at one game hour per second, plus a margin for the
// frame that starts the action: an action that lasts that many hours is over.
// In the middle of an action the time is only known to within the margin.
export const elapse = async (page: Page, hours: number) => {
  await page.clock.runFor(hours * 1000 + 300);
};

// Opens a page of the menu (on mobile the icon rail is there, folded or not).
export const openPage = async (page: Page, name: string) => {
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

// Moves to a place from the destination list and the Go button.
export const moveTo = async (page: Page, place: string) => {
  await page.getByRole('combobox', { name: 'Destination' }).selectOption({
    label: place,
  });
  await page.getByRole('button', { name: 'Go', exact: true }).click();
};
