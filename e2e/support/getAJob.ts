import type { Page } from '@playwright/test';

// Takes the clothes seller job from the home page: an hour of searching.
export const getAJob = async (page: Page) => {
  await page.getByRole('button', { name: 'Look for a job' }).click();
  await page.getByRole('button', { name: 'Clothes seller' }).click();
};
