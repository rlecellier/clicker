import type { Page } from '@playwright/test';

// Takes the clothes seller job from the home page.
export const getAJob = async (page: Page) => {
  await page.getByRole('button', { name: 'Get a Job' }).click();
  await page.getByRole('button', { name: 'Clothes seller' }).click();
};
