import { doneOnDay, type DoneEntry } from '@game/history';
import { shiftsOnDay, type Employment } from '@game/jobs';
import { dayOfMonth, HOURS_PER_DAY, weekdayLabel } from '@game/time';

import styles from './DayTimeline.module.css';

// Days on each side of the current one that are drawn: enough to fill the
// whole width while the days slide, even before the first day of the game.
const DAYS_AROUND = 4;

type DayTimelineProps = {
  // UTC midnight, in ms, of day 0 of the game
  origin: number;
  // what the player did, drawn on each day
  history: DoneEntry[];
  // the job whose shifts are outlined on each day
  job?: Employment;
  // absolute day plus the fraction already gone, e.g. 3.5 is noon on day 3
  dayPosition: number;
  // accessible description of the current moment
  label: string;
};

const percentOfDay = (hour: number) => `${(hour / HOURS_PER_DAY) * 100}%`;

// Days scroll from right to left under a fixed marker in the middle.
export const DayTimeline = ({
  origin,
  history,
  job,
  dayPosition,
  label,
}: DayTimelineProps) => {
  const currentDay = Math.floor(dayPosition);
  const days = Array.from(
    { length: 2 * DAYS_AROUND + 1 },
    (_, index) => currentDay - DAYS_AROUND + index,
  );

  return (
    <div className={styles.root} role="img" aria-label={label}>
      {days.map((day) => (
        <div
          key={day}
          className={styles.day}
          data-current={day === currentDay || undefined}
          data-before-start={day < 0 || undefined}
          style={{
            left: `calc(50% + (${day - dayPosition}) * var(--day-width))`,
          }}
        >
          <span className={styles.name}>
            {weekdayLabel(origin, day)} {dayOfMonth(origin, day)}
          </span>
          <div className={styles.track}>
            {shiftsOnDay(job, day).map((shift) => (
              <div
                key={shift.id}
                className={styles.obligation}
                style={{
                  left: percentOfDay(shift.start),
                  width: percentOfDay(shift.end - shift.start),
                }}
              />
            ))}
            {doneOnDay(history, day).map((entry) => (
              <div
                key={entry.id}
                className={styles.event}
                data-kind={entry.kind}
                style={{
                  left: percentOfDay(entry.start),
                  width: percentOfDay(entry.end - entry.start),
                }}
              />
            ))}
          </div>
        </div>
      ))}
      <div className={styles.marker} />
    </div>
  );
};
