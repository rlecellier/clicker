import { expect, test } from 'vitest';

import { hireAt, isJobId, JOB_IDS, JOBS } from './jobs';

test('the clothes seller is the only job for now', () => {
  expect(JOB_IDS).toEqual(['clothes-seller']);
  expect(isJobId('clothes-seller')).toBe(true);
  expect(isJobId('astronaut')).toBe(false);
});

test('the job requires work, and the player plans to go there', () => {
  const job = JOBS['clothes-seller'];
  expect(job.obligations.map((event) => event.title)).toEqual([
    'Sell clothes',
    'Sell clothes',
  ]);
  expect(job.plan.map((event) => event.title)).toEqual([
    'Go to work',
    'Go to work',
  ]);
  // the plan goes to work at the very hours the job requires
  expect(job.plan.map(({ start, end }) => [start, end])).toEqual(
    job.obligations.map(({ start, end }) => [start, end]),
  );
});

test('is hired at a given game hour', () => {
  expect(hireAt('clothes-seller', 30)).toEqual({
    id: 'clothes-seller',
    since: 30,
  });
});
