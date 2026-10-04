import { DAYS_PER_WEEK, HOURS_PER_DAY } from '@hook/useWeekClock';

import styles from './WeekCalendar.module.css';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type WeekCalendarProps = {
  // hours elapsed since Monday 00:00, between 0 and 7 * 24
  weekHour: number;
};

export function WeekCalendar({ weekHour }: WeekCalendarProps) {
  const currentDay = Math.floor(weekHour / HOURS_PER_DAY);
  const dayRatio = (weekHour % HOURS_PER_DAY) / HOURS_PER_DAY;
  const hour = Math.floor(weekHour % HOURS_PER_DAY);

  return (
    <div
      className={styles.root}
      role="img"
      aria-label={`${DAY_LABELS[currentDay]}, ${String(hour).padStart(2, '0')}:00`}
    >
      {Array.from({ length: DAYS_PER_WEEK }, (_, day) => (
        <div
          key={day}
          className={styles.day}
          data-current={day === currentDay || undefined}
        >
          <span className={styles.label}>{DAY_LABELS[day]}</span>
          <div className={styles.bar}>
            {day === currentDay && (
              <div
                className={styles.cursor}
                style={{ top: `${dayRatio * 100}%` }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
