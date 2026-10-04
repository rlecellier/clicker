import { expect, test } from 'vitest';

import { rangeLabel, visibleDays } from './calendarRange';

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
  expect(rangeLabel([2])).toBe('Wed 3 Feb 2027');
});

test('labels a week within one month', () => {
  expect(rangeLabel(visibleDays(0, 'week'))).toBe('1 – 7 Feb 2027');
});

test('names both months when the week spans two of them', () => {
  // 22 February to 28 February, then 1 March to 7 March
  expect(rangeLabel(visibleDays(24, 'week'))).toBe('22 – 28 Feb 2027');
  expect(rangeLabel([24, 25, 26, 27, 28, 29, 30])).toBe('25 Feb – 3 Mar 2027');
});

test('names both years when the week spans two of them', () => {
  // 1 January 2028 is day 334; the week of Monday 27 December 2027 is 329-335
  expect(rangeLabel([329, 330, 331, 332, 333, 334, 335])).toBe(
    '27 Dec 2027 – 2 Jan 2028',
  );
});
