import type { CSSProperties } from 'react';

import {
  eventsOnDay,
  occursOn,
  type CalendarEvent,
  type Schedule,
} from '@game/calendar';
import { dayOfMonth, HOURS_PER_DAY, weekdayLabel } from '@game/time';

import styles from './CalendarGrid.module.css';

type CalendarGridProps = {
  // days of the game to show side by side, as days since the start of the game
  days: number[];
  // what the player plans to do, in the main lane of each day
  schedule: Schedule;
  // what the player must do, in a thin lane beside it
  obligations: CalendarEvent[];
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

const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

// Days side by side, one column each, with the events of the day at their
// hours.
export const CalendarGrid = ({
  days,
  schedule,
  obligations,
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
          <span className={styles.number}>{dayOfMonth(day)}</span>
          <span>{weekdayLabel(day)}</span>
        </div>
      ))}

      <div className={styles.hours} aria-hidden>
        {HOUR_LABELS.map((hour) => (
          <span
            key={hour}
            className={styles.hour}
            style={{ top: percentOfDay(hour) }}
          >
            {formatHour(hour)}
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
            aria-label={`${weekdayLabel(day)} ${dayOfMonth(day)}`}
          >
            {obligations
              .filter((event) => occursOn(event, day))
              .map((event) => (
                <li
                  key={`must-${event.id}`}
                  className={styles.obligation}
                  style={{
                    top: percentOfDay(event.start),
                    height: percentOfDay(event.end - event.start),
                  }}
                  title={`Must: ${event.title} ${formatHour(event.start)}–${formatHour(event.end)}`}
                >
                  <span className={styles.hidden}>Must: {event.title}</span>
                </li>
              ))}
            {eventsOnDay(schedule, day).map((event) => (
              <li
                key={event.id}
                className={styles.event}
                data-kind={event.kind}
                data-mode={event.mode}
                style={{
                  top: percentOfDay(event.start),
                  height: percentOfDay(event.end - event.start),
                }}
                title={`${event.title} ${formatHour(event.start)}–${formatHour(event.end)}`}
              >
                {event.title}
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
