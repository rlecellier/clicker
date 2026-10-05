import type { Page } from '@playwright/test';

// Monday 5 October 2026, 07:00: the player's date and time when the game starts.
export const MONDAY_MORNING = new Date(2026, 9, 5, 7, 0);

// Opens a new game, launched at the given moment of the player's clock. The
// clock stays still: the game does not depend on it once it has started.
export const startGame = async (page: Page, now = MONDAY_MORNING) => {
  await page.clock.setFixedTime(now);
  await page.goto('/');
};

// Opens a page of the menu (the menu is closed on mobile).
export const openPage = async (page: Page, name: string) => {
  const menu = page.getByRole('button', { name: 'Menu' });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('link', { name, exact: true }).click();
};
