import {
  dayOfMonth,
  HOURS_PER_DAY,
  weekdayIndex,
  weekdayLabel,
} from '@game/time';

import { CalendarDay } from './CalendarDay';
import { calendarWindow } from './calendarWindow';
import styles from './WeekCalendar.module.css';

type WeekCalendarProps = {
  // full weeks played since the start of the game
  week: number;
  // hours elapsed since Monday 00:00 of the current week, between 0 and 7 * 24
  weekHour: number;
};

export const WeekCalendar = ({ week, weekHour }: WeekCalendarProps) => {
  const { firstDay, columns, monthLabel } = calendarWindow(week, weekHour);
  const hour = Math.floor(weekHour % HOURS_PER_DAY);
  const dayRatio = (weekHour % HOURS_PER_DAY) / HOURS_PER_DAY;

  return (
    <div
      className={styles.root}
      role="img"
      aria-label={`${weekdayLabel(firstDay)}, ${String(hour).padStart(2, '0')}:00`}
    >
      <div className={styles.month}>{monthLabel}</div>
      <div className={styles.viewport}>
        {columns.map((absoluteDay) => (
          <CalendarDay
            key={absoluteDay}
            weekday={weekdayLabel(absoluteDay)}
            dayOfMonth={dayOfMonth(absoluteDay)}
            weekdayIndex={weekdayIndex(absoluteDay)}
            offset={absoluteDay - firstDay}
            isCurrent={absoluteDay === firstDay}
            dayRatio={dayRatio}
          />
        ))}
      </div>
    </div>
  );
};
