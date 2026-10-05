import type { DoneEntry } from './types';

const KINDS = new Set([
  'work',
  'meal',
  'sleep',
  'read',
  'search',
  'think',
  'shopping',
]);

// A save comes from outside: an entry is checked before it joins the history.
export const isDoneEntry = (value: unknown): value is DoneEntry => {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.kind === 'string' &&
    KINDS.has(entry.kind) &&
    typeof entry.title === 'string' &&
    typeof entry.start === 'number' &&
    typeof entry.end === 'number' &&
    Number.isFinite(entry.start) &&
    Number.isFinite(entry.end) &&
    entry.start >= 0 &&
    entry.end > entry.start
  );
};
