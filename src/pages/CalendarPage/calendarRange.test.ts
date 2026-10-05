import { expect, test } from 'vitest';

import { rangeLabel, visibleDays } from './calendarRange';

// Monday 1 February 2027
const ORIGIN = Date.UTC(2027, 1, 1);

test('the day view shows only the selected day', () => {
  expect(visibleDays(9, 'day')).toEqual([9]);
});

test('the week view shows the whole week, from Monday to Sunday', () => {
  expect(visibleDays(0, 'week')).toEqual([0, 1, 2, 3, 4, 5, 6]);
  // day 9 is a Wednesday
  expect(visibleDays(9, 'week')).toEqual([7, 8, 9, 10, 11, 12, 13]);
  expect(visibleDays(13, 'week')).toEqual([7, 8, 9, 10, 11, 12, 13]);
});

test('labels a day with its weekday and its full date', () => {
  expect(rangeLabel(ORIGIN, [2])).toBe('Wed 9 Feb 2027');
});

test('labels a week within one month', () => {
  expect(rangeLabel(ORIGIN, visibleDays(0, 'week'))).toBe('1 – 28 Feb 2027');
});

test('a week is a month: it always stays within one month and one year', () => {
  // week 1 of February 2027 is March, week 10 is December, week 11 is January
  expect(rangeLabel(ORIGIN, visibleDays(7, 'week'))).toBe('1 – 28 Mar 2027');
  expect(rangeLabel(ORIGIN, visibleDays(77, 'week'))).toBe('1 – 28 Jan 2028');
  expect(rangeLabel(ORIGIN, [76])).toBe('Sun 25 Dec 2027');
});
