import { EVENTS } from '@game/calendar';
import {
  dayOfMonth,
  HOURS_PER_DAY,
  weekdayIndex,
  weekdayLabel,
} from '@game/time';

import styles from './DayTimeline.module.css';

// Days on each side of the current one that are drawn: enough to fill the
// banner while the days slide.
const DAYS_AROUND = 4;

type DayTimelineProps = {
  // absolute day plus the fraction already gone, e.g. 3.5 is noon on day 3
  dayPosition: number;
  // accessible description of the current moment
  label: string;
};

// Days scroll from right to left under a fixed marker in the middle.
export const DayTimeline = ({ dayPosition, label }: DayTimelineProps) => {
  const currentDay = Math.floor(dayPosition);
  const days = Array.from(
    { length: 2 * DAYS_AROUND + 1 },
    (_, index) => currentDay - DAYS_AROUND + index,
  ).filter((day) => day >= 0);

  return (
    <div className={styles.root} role="img" aria-label={label}>
      {days.map((day) => (
        <div
          key={day}
          className={styles.day}
          data-current={day === currentDay || undefined}
          style={{
            left: `calc(50% + (${day - dayPosition}) * var(--day-width))`,
          }}
        >
          <span className={styles.name}>
            {weekdayLabel(day)} {dayOfMonth(day)}
          </span>
          <div className={styles.track}>
            {EVENTS.filter((event) =>
              event.days.includes(weekdayIndex(day)),
            ).map((event) => (
              <div
                key={event.id}
                className={styles.event}
                data-kind={event.kind}
                style={{
                  left: `${(event.start / HOURS_PER_DAY) * 100}%`,
                  width: `${((event.end - event.start) / HOURS_PER_DAY) * 100}%`,
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
