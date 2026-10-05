import { expect, test } from 'vitest';

import { doneOnDay, hoursDone, recordDone } from './history';
import type { DoneEntry } from './types';

const work = (start: number, end: number): DoneEntry => ({
  kind: 'work',
  title: 'Work',
  start,
  end,
});

test('the first action starts the history', () => {
  expect(recordDone([], work(8, 8.5))).toEqual([work(8, 8.5)]);
});

test('the same action done again right away is merged', () => {
  const history = recordDone(recordDone([], work(8, 8.5)), work(8.5, 9));
  expect(history).toEqual([work(8, 9)]);
});

test('a pause or another action keeps the entries apart', () => {
  const lunch: DoneEntry = {
    kind: 'meal',
    title: 'Lunch',
    start: 9,
    end: 10,
  };
  const history = recordDone(recordDone([work(8, 9)], lunch), work(10, 10.5));
  expect(history).toEqual([work(8, 9), lunch, work(10, 10.5)]);
  expect(recordDone([work(8, 9)], work(9.5, 10))).toHaveLength(2);
});

test('two meals in a row stay two meals', () => {
  const breakfast: DoneEntry = {
    kind: 'meal',
    title: 'Breakfast',
    start: 7,
    end: 7.5,
  };
  const lunch: DoneEntry = {
    ...breakfast,
    title: 'Lunch',
    start: 7.5,
    end: 8.5,
  };
  expect(recordDone([breakfast], lunch)).toEqual([breakfast, lunch]);
});

test('an entry is cut at midnight when it is shown day by day', () => {
  const night: DoneEntry = {
    kind: 'sleep',
    title: 'Sleep',
    start: 22,
    end: 30,
  };
  expect(doneOnDay([night], 0)).toMatchObject([{ start: 22, end: 24 }]);
  expect(doneOnDay([night], 1)).toMatchObject([{ start: 0, end: 6 }]);
  expect(doneOnDay([night], 2)).toEqual([]);
});

test('counts the hours spent on a kind of action', () => {
  const history = [work(8, 10), work(13, 14.5)];
  expect(hoursDone(history, 'work')).toBe(3.5);
  expect(hoursDone(history, 'sleep')).toBe(0);
});
