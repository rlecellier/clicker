import {
  eventAt,
  fitsInPlan,
  nextAskStart,
  type CalendarEvent,
  occurrenceKey,
} from '@game/calendar';
import { payBetween } from '@game/earnings';
import {
  addExpenses,
  expensesBetween,
  totalExpensesCents,
} from '@game/expenses';
import { hireAt, JOBS, type JobId } from '@game/jobs';
import {
  eatSnack,
  isEnjoyingCake,
  startCake,
  stepNutrition,
} from '@game/nutrition';
import { readingHoursBetween, startBook, stepReading } from '@game/reading';
import { stepSleep } from '@game/sleep';
import { HOURS_PER_DAY, HOURS_PER_SECOND, SPEEDS } from '@game/time';
import { newGameState, type GameState } from './types';

export type GameAction =
  // real seconds went by: the game runs at its current speed. `roll` in
  // [0, 1) draws the next book when a reading event starts without one
  | { type: 'elapse'; seconds: number; roll: number }
  | { type: 'eatSnack' }
  | { type: 'enjoyCake' }
  | { type: 'speedUp' }
  | { type: 'slowDown' }
  // the player takes a job: its hours become their duty and their plan
  | { type: 'takeJob'; jobId: JobId }
  // the player adds an event to their plan, if it fits
  | { type: 'planEvent'; event: Omit<CalendarEvent, 'id'> }
  // the player answers the `ask` event the game is waiting on
  | { type: 'answerAsk'; isAccepted: boolean }
  // a brand new game, whatever the current one
  | { type: 'restart'; birthDate: string };

// The day of an occurrence key (see `occurrenceKey`).
const dayOfKey = (key: string) => Number(key.split('@', 2)[1]);

// Runs the game hours between `from` and `to`, with no pause in between.
const run = (
  previous: GameState,
  from: number,
  to: number,
  roll: number,
): GameState => {
  const state = { ...previous, ...startBook(previous, from, to, roll) };
  const paid = expensesBetween(state, from, to);
  const today = Math.floor(to / HOURS_PER_DAY);
  return {
    ...state,
    ...stepNutrition(state, from, to),
    ...stepSleep(state, from, to, readingHoursBetween(state, from, to)),
    ...stepReading(state, from, to),
    elapsedHours: to,
    // the balance can go below zero: the bills are paid anyway
    balanceCents:
      state.balanceCents +
      payBetween(state.job, from, to) -
      totalExpensesCents(paid),
    expenses: addExpenses(state.expenses, paid),
    // the days gone by need no memory of what was declined
    declined: state.declined.filter((key) => dayOfKey(key) >= today),
  };
};

// Runs `hours` game hours, however many there are: a hidden tab comes back
// with all the time that went by and the game catches up. It stops at the
// first `ask` event, until the player answers, and does not run while waiting.
const advance = (state: GameState, hours: number, roll: number): GameState => {
  if (state.asking) return state;
  const from = state.elapsedHours;
  const to = from + hours;
  const ask = nextAskStart(state, from, to);
  if (!ask) return run(state, from, to, roll);
  return {
    ...run(state, from, ask.time, roll),
    asking: { eventId: ask.event.id, day: ask.day },
  };
};

// An id that no event of the plan has yet.
const freeId = (plan: CalendarEvent[], kind: string) => {
  let count = plan.length;
  while (plan.some((event) => event.id === `${kind}-${count}`)) count += 1;
  return `${kind}-${count}`;
};

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'elapse': {
      const speed = SPEEDS[state.speedIndex] ?? 1;
      return advance(
        state,
        action.seconds * HOURS_PER_SECOND * speed,
        action.roll,
      );
    }
    case 'eatSnack': {
      return { ...state, ...eatSnack(state) };
    }
    case 'enjoyCake': {
      return isEnjoyingCake(state, state.elapsedHours)
        ? state
        : { ...state, ...startCake(state, state.elapsedHours) };
    }
    case 'speedUp': {
      return {
        ...state,
        speedIndex: Math.min(state.speedIndex + 1, SPEEDS.length - 1),
      };
    }
    case 'slowDown': {
      return { ...state, speedIndex: Math.max(state.speedIndex - 1, 0) };
    }
    case 'takeJob': {
      if (state.job) return state;
      const planned = JOBS[action.jobId].plan.filter((event) =>
        fitsInPlan(state.plan, event),
      );
      return {
        ...state,
        job: hireAt(action.jobId, state.elapsedHours),
        plan: [...state.plan, ...planned],
      };
    }
    case 'planEvent': {
      const event = {
        ...action.event,
        id: freeId(state.plan, action.event.kind),
      };
      if (!fitsInPlan(state.plan, event)) return state;
      const planned = { ...state, plan: [...state.plan, event] };
      // An ask event planned while it should already run asks at once: its
      // start is gone and would never be crossed.
      const isRunning = eventAt(planned, state.elapsedHours)?.id === event.id;
      return isRunning && event.mode === 'ask'
        ? {
            ...planned,
            asking: {
              eventId: event.id,
              day: Math.floor(state.elapsedHours / HOURS_PER_DAY),
            },
          }
        : planned;
    }
    case 'answerAsk': {
      const { asking } = state;
      if (!asking) return state;
      const event = state.plan.find(({ id }) => id === asking.eventId);
      return {
        ...state,
        asking: undefined,
        declined:
          !event || action.isAccepted
            ? state.declined
            : [...state.declined, occurrenceKey(event, asking.day)],
      };
    }
    case 'restart': {
      return newGameState(action.birthDate);
    }
  }
};
