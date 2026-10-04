import { expect, test } from 'vitest';

import { EMPLOYMENT } from '@test/schedules';

import {
  isWorkHours,
  obligationHoursBetween,
  payBetween,
  pendingPayCents,
  weeklyPayCents,
} from './earnings';

test('a week pays a quarter of the salary in a 28-day month', () => {
  expect(weeklyPayCents(0)).toBe(25_000);
});

test('a week pays less in a 31-day month', () => {
  // week 4 starts Monday March 1st
  expect(weeklyPayCents(4)).toBe(22_581);
});

test('nothing is earned without a job', () => {
  expect(pendingPayCents(undefined, 5 * 24)).toBe(0);
  expect(payBetween(undefined, 0, 168)).toBe(0);
  expect(isWorkHours(undefined, 10)).toBe(false);
});

test('nothing is earned before the first work hour', () => {
  expect(pendingPayCents(EMPLOYMENT, 7.9)).toBe(0);
});

test('pay grows during work hours and holds over lunch', () => {
  expect(pendingPayCents(EMPLOYMENT, 10)).toBeGreaterThan(0);
  expect(pendingPayCents(EMPLOYMENT, 12.5)).toBe(
    pendingPayCents(EMPLOYMENT, 12),
  );
  expect(pendingPayCents(EMPLOYMENT, 15)).toBeGreaterThan(
    pendingPayCents(EMPLOYMENT, 12),
  );
});

test('a full working week earns the whole weekly pay', () => {
  expect(pendingPayCents(EMPLOYMENT, 5 * 24)).toBe(25_000);
  expect(pendingPayCents(EMPLOYMENT, 168 - 1e-9)).toBe(25_000);
  expect(payBetween(EMPLOYMENT, 0, 168)).toBe(25_000);
});

test('the pay of the next week starts over', () => {
  expect(pendingPayCents(EMPLOYMENT, 168 + 9)).toBeGreaterThan(0);
  expect(pendingPayCents(EMPLOYMENT, 168 + 9)).toBeLessThan(25_000);
});

test('the first week pays only the hours worked since the hire', () => {
  // hired on Wednesday morning: three of the five days
  const hired = { id: EMPLOYMENT.id, since: 2 * 24 + 8 };
  expect(pendingPayCents(hired, 5 * 24)).toBe(15_000);
  expect(payBetween(hired, 0, 168)).toBe(15_000);
  expect(isWorkHours(hired, 2 * 24 + 7)).toBe(false);
  expect(isWorkHours(hired, 2 * 24 + 9)).toBe(true);
});

test('works from 8h to 12h and 13h to 18h on weekdays', () => {
  expect(isWorkHours(EMPLOYMENT, 8)).toBe(true);
  expect(isWorkHours(EMPLOYMENT, 12.5)).toBe(false);
  expect(isWorkHours(EMPLOYMENT, 13)).toBe(true);
  expect(isWorkHours(EMPLOYMENT, 18)).toBe(false);
  expect(isWorkHours(EMPLOYMENT, 5 * 24 + 9)).toBe(false);
});

test('counts the hours the job requires in an interval', () => {
  expect(obligationHoursBetween(EMPLOYMENT, 0, 168)).toBe(45);
  expect(obligationHoursBetween(EMPLOYMENT, 9, 10)).toBe(1);
  expect(obligationHoursBetween(EMPLOYMENT, 12, 13)).toBe(0);
});
