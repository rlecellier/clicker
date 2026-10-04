import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';

const CONFIG_PATH = path.resolve('e2e/demo.json');

const wantedShots = (): string[] => {
  if (!existsSync(CONFIG_PATH)) return [];
  const config: { screenshots?: string[] } = JSON.parse(
    readFileSync(CONFIG_PATH, 'utf8'),
  );
  return config.screenshots ?? [];
};

// Takes a screenshot for the MR demo. It does nothing unless the `MR demo`
// workflow runs (`DEMO=1`) and `name` is listed in `e2e/demo.json`.
export const demoShot = async (page: Page, name: string) => {
  if (!process.env.DEMO || !wantedShots().includes(name)) return;
  await page.screenshot({ path: `demo/${name}.png` });
};
