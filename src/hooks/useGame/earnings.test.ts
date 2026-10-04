import { expect, test } from 'vitest';

import { bankedPay, isWorking, pendingPay, weeklyPay } from './earnings';

test('a week pays a quarter of the salary in a 28-day month', () => {
  expect(weeklyPay(0)).toBe(250);
});

test('a week pays less in a 31-day month', () => {
  // week 4 starts Monday March 1st
  expect(weeklyPay(4)).toBe(225.81);
});

test('nothing is earned before the first work hour', () => {
  expect(pendingPay(0, 7.9)).toBe(0);
});

test('pay grows during work hours and holds over lunch', () => {
  expect(pendingPay(0, 10)).toBeGreaterThan(0);
  expect(pendingPay(0, 12.5)).toBe(pendingPay(0, 12));
  expect(pendingPay(0, 15)).toBeGreaterThan(pendingPay(0, 12));
});

test('a full working week earns the whole weekly pay', () => {
  expect(pendingPay(0, 5 * 24)).toBe(250);
  expect(pendingPay(0, 168)).toBe(250);
});

test('banks the pay of finished weeks only', () => {
  expect(bankedPay(0)).toBe(0);
  expect(bankedPay(2)).toBe(500);
});

test('works from 8h to 12h and 13h to 18h on weekdays', () => {
  expect(isWorking(8)).toBe(true);
  expect(isWorking(12.5)).toBe(false);
  expect(isWorking(13)).toBe(true);
  expect(isWorking(18)).toBe(false);
  expect(isWorking(5 * 24 + 9)).toBe(false);
});
