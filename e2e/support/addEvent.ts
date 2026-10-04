import type { Page } from '@playwright/test';

type EventForm = {
  from: string;
  to: string;
  // the label of the repeat option, "Every day" when omitted
  repeat?: string;
  // "Ask me first" when true, "Start automatically" otherwise
  asks?: boolean;
};

// Plans a reading event from the calendar page, which must be open.
export const addEvent = async (page: Page, form: EventForm) => {
  await page.getByRole('button', { name: 'Add event' }).click();
  await page.getByLabel('From', { exact: true }).fill(form.from);
  await page.getByLabel('To', { exact: true }).fill(form.to);
  await page
    .getByLabel('Repeat')
    .selectOption({ label: form.repeat ?? 'Every day' });
  await page
    .getByLabel(form.asks ? 'Ask me first' : 'Start automatically')
    .check();
  await page.getByRole('button', { name: 'Add to my plan' }).click();
};
