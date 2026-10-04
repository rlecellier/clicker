// Records a demo of the app: key screenshots plus an animated GIF.
// Usage: node scripts/demo.mjs [outputDir]
// Needs a production build (`npm run build`) and ffmpeg for the GIF.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { preview } from 'vite';

const outputDirectory = process.argv[2] ?? 'demo-output';
const framesDirectory = path.join(outputDirectory, 'frames');
const GAME_HOUR_MS = 1000;
const FRAME_EVERY_HOURS = 6;
const WEEK_HOURS = 7 * 24;

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(framesDirectory, { recursive: true });

const server = await preview({ preview: { port: 4173 } });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});

try {
  const page = await browser.newPage({ viewport: { width: 480, height: 560 } });
  await page.clock.install({ time: 0 });
  await page.goto('http://localhost:4173/');
  await page.getByRole('img').waitFor();

  // Advance the fake clock and capture the whole week, Monday to Sunday.
  const total = WEEK_HOURS / FRAME_EVERY_HOURS;
  for (let index = 0; index < total; index++) {
    await page.clock.runFor(FRAME_EVERY_HOURS * GAME_HOUR_MS);
    const name = String(index).padStart(3, '0');
    await page.screenshot({ path: path.join(framesDirectory, `${name}.png`) });
  }

  // Key screenshots for the MR description.
  const keyFrames = { start: 0, midweek: 10, weekend: 25 };
  for (const [label, index] of Object.entries(keyFrames)) {
    execFileSync('cp', [
      path.join(framesDirectory, `${String(index).padStart(3, '0')}.png`),
      path.join(outputDirectory, `${label}.png`),
    ]);
  }

  execFileSync('ffmpeg', [
    '-y',
    '-loglevel',
    'error',
    '-framerate',
    '6',
    '-i',
    path.join(framesDirectory, '%03d.png'),
    '-vf',
    'split[a][b];[a]palettegen[p];[b][p]paletteuse',
    '-loop',
    '0',
    path.join(outputDirectory, 'demo.gif'),
  ]);
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
