import { expect, test } from '@playwright/test';

import { startGame } from './support';

test('the header shows the age, the gold coins and the game time', async ({
  page,
}) => {
  await startGame(page);

  const header = page.getByRole('banner');
  await expect(header.getByText('18 yo')).toBeVisible();
  await expect(header.getByRole('status', { name: 'Gold coins' })).toHaveText(
    '0',
  );
  await expect(header.getByRole('timer')).toContainText('Mon 5 Oct 2026');
});
