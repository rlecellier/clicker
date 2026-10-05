import type { Page } from '@playwright/test';

import { elapse } from './startGame';

// Takes the clothes seller job from the home page: an hour of searching.
export const getAJob = async (page: Page) => {
  await page.getByRole('button', { name: 'Look for a job' }).click();
  await page.getByRole('button', { name: 'Clothes seller' }).click();
  await elapse(page, 1);
};
