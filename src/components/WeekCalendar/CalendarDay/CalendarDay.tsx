import { EVENTS } from '@game/calendar';
import { HOURS_PER_DAY } from '@game/time';

import styles from './CalendarDay.module.css';

type CalendarDayProps = {
  weekday: string;
  dayOfMonth: number;
  // 0 = Monday
  weekdayIndex: number;
  // columns to the right (or left, if negative) of the first visible day
  offset: number;
  isCurrent: boolean;
  // ratio of the day already gone, between 0 and 1; used by the current day
  dayRatio: number;
};

export const CalendarDay = ({
  weekday,
  dayOfMonth,
  weekdayIndex,
  offset,
  isCurrent,
  dayRatio,
}: CalendarDayProps) => {
  return (
    <div
      className={styles.day}
      data-current={isCurrent || undefined}
      style={{ transform: `translateX(${offset * 100}%)` }}
    >
      <span className={styles.number}>{dayOfMonth}</span>
      <span className={styles.label}>{weekday}</span>
      <div className={styles.bar}>
        {EVENTS.filter((event) => event.days.includes(weekdayIndex)).map(
          (event) => (
            <div
              key={event.id}
              className={styles.event}
              data-kind={event.kind}
              style={{
                top: `${(event.start / HOURS_PER_DAY) * 100}%`,
                height: `${((event.end - event.start) / HOURS_PER_DAY) * 100}%`,
              }}
              title={`${event.title} ${event.start}:00–${event.end}:00`}
            />
          ),
        )}
        {isCurrent && (
          <div
            className={styles.cursor}
            style={{ top: `${dayRatio * 100}%` }}
          />
        )}
      </div>
    </div>
  );
};
