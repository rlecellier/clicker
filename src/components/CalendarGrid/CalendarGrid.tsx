import type { CSSProperties } from 'react';

import { doneOnDay, type DoneEntry } from '@game/history';
import { shiftsOnDay, type Employment } from '@game/jobs';
import {
  dayOfMonth,
  formatClock,
  HOURS_PER_DAY,
  weekdayLabel,
} from '@game/time';

import styles from './CalendarGrid.module.css';

type CalendarGridProps = {
  // UTC midnight, in ms, of day 0 of the game
  origin: number;
  // days of the game to show side by side, as days since the start of the game
  days: number[];
  // what the player did, in the main lane of each day
  history: DoneEntry[];
  // the job whose shifts the player must work, in a thin lane beside it
  job?: Employment;
  // the day the game is on, which gets the cursor
  currentDay: number;
  // ratio of the current day already gone, between 0 and 1
  dayRatio: number;
  // 1 shows the whole day in the available height; more makes events taller
  zoom?: number;
};

// The hours shown in the left margin.
const HOUR_LABELS = Array.from(
  { length: HOURS_PER_DAY / 3 },
  (_, index) => index * 3,
);

const percentOfDay = (hour: number) => `${(hour / HOURS_PER_DAY) * 100}%`;

const range = (start: number, end: number) =>
  `${formatClock(start)}–${formatClock(end)}`;

// Days side by side, one column each, with what the player must do (thin
// lane) and what they did (main lane) at their hours.
export const CalendarGrid = ({
  origin,
  days,
  history,
  job,
  currentDay,
  dayRatio,
  zoom = 1,
}: CalendarGridProps) => {
  return (
    <div
      className={styles.root}
      style={
        {
          gridTemplateColumns: `2.5rem repeat(${days.length}, 1fr)`,
          '--zoom': zoom,
        } as CSSProperties
      }
    >
      <div className={styles.corner} />
      {days.map((day) => (
        <div
          key={day}
          className={styles.heading}
          data-current={day === currentDay || undefined}
        >
          <span className={styles.number}>{dayOfMonth(origin, day)}</span>
          <span>{weekdayLabel(origin, day)}</span>
          <span className={styles.lanes} aria-hidden>
            <span>Must</span>
            <span>Done</span>
          </span>
        </div>
      ))}
      <div className={styles.hours} aria-hidden>
        {HOUR_LABELS.map((hour) => (
          <span
            key={hour}
            className={styles.hour}
            style={{ top: percentOfDay(hour) }}
          >
            {String(hour).padStart(2, '0')}:00
          </span>
        ))}
      </div>
      {days.map((day) => {
        const isCurrent = day === currentDay;
        return (
          <ul
            key={day}
            className={styles.day}
            data-current={isCurrent || undefined}
            aria-label={`${weekdayLabel(origin, day)} ${dayOfMonth(origin, day)}`}
          >
            {shiftsOnDay(job, day).map((shift) => (
              <li
                key={`must-${shift.id}`}
                className={styles.obligation}
                style={{
                  top: percentOfDay(shift.start),
                  height: percentOfDay(shift.end - shift.start),
                }}
                title={`Must: ${shift.title} ${range(shift.start, shift.end)}`}
              >
                <span className={styles.hidden}>Must: {shift.title}</span>
              </li>
            ))}
            {doneOnDay(history, day).map((entry) => (
              <li
                key={entry.id}
                className={styles.event}
                data-kind={entry.kind}
                style={{
                  top: percentOfDay(entry.start),
                  height: percentOfDay(entry.end - entry.start),
                }}
                title={`${entry.title} ${range(entry.start, entry.end)}`}
              >
                {entry.title}
              </li>
            ))}
            {isCurrent && (
              <li
                className={styles.cursor}
                style={{ top: percentOfDay(dayRatio * HOURS_PER_DAY) }}
                aria-hidden
              />
            )}
          </ul>
        );
      })}
    </div>
  );
};
