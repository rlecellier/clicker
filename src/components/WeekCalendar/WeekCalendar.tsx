import { GAME_START } from '@hook/useGame';
import { DAYS_PER_WEEK, EVENTS, HOURS_PER_DAY } from '@hook/useWeekClock';

import styles from './WeekCalendar.module.css';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const MS_PER_DAY = HOURS_PER_DAY * 3600 * 1000;
// One column is kept on each side of the visible week so that days can slide
// in and out of view.
const COLUMNS_BEFORE = 1;
const COLUMNS_AFTER = 2;

type WeekCalendarProps = {
  // full weeks played since the start of the game
  week: number;
  // hours elapsed since Monday 00:00 of the current week, between 0 and 7 * 24
  weekHour: number;
};

const dateOf = (absoluteDay: number) =>
  new Date(GAME_START + absoluteDay * MS_PER_DAY);

export const WeekCalendar = ({ week, weekHour }: WeekCalendarProps) => {
  const currentDay = Math.floor(weekHour / HOURS_PER_DAY);
  const firstDay = week * DAYS_PER_WEEK + currentDay;
  const hour = Math.floor(weekHour % HOURS_PER_DAY);
  const dayRatio = (weekHour % HOURS_PER_DAY) / HOURS_PER_DAY;

  // The calendar always starts on the current day and shows the next seven.
  const firstMonth = MONTH_LABELS[dateOf(firstDay).getUTCMonth()];
  const lastMonth =
    MONTH_LABELS[dateOf(firstDay + DAYS_PER_WEEK - 1).getUTCMonth()];
  const monthLabel =
    firstMonth === lastMonth ? firstMonth : `${firstMonth} – ${lastMonth}`;

  const columns = Array.from(
    { length: COLUMNS_BEFORE + DAYS_PER_WEEK + COLUMNS_AFTER },
    (_, index) => firstDay - COLUMNS_BEFORE + index,
  ).filter((absoluteDay) => absoluteDay >= 0);

  return (
    <div
      className={styles.root}
      role="img"
      aria-label={`${DAY_LABELS[currentDay]}, ${String(hour).padStart(2, '0')}:00`}
    >
      <div className={styles.month}>{monthLabel}</div>
      <div className={styles.viewport}>
        {columns.map((absoluteDay) => {
          const weekday = absoluteDay % DAYS_PER_WEEK;
          return (
            <div
              key={absoluteDay}
              className={styles.day}
              data-current={absoluteDay === firstDay || undefined}
              style={{
                transform: `translateX(${(absoluteDay - firstDay) * 100}%)`,
              }}
            >
              <span className={styles.number}>
                {dateOf(absoluteDay).getUTCDate()}
              </span>
              <span className={styles.label}>{DAY_LABELS[weekday]}</span>
              <div className={styles.bar}>
                {EVENTS.filter((event) => event.days.includes(weekday)).map(
                  (event) => (
                    <div
                      key={event.id}
                      className={styles.event}
                      style={{
                        top: `${(event.start / HOURS_PER_DAY) * 100}%`,
                        height: `${((event.end - event.start) / HOURS_PER_DAY) * 100}%`,
                      }}
                      title={`${event.title} ${event.start}:00–${event.end}:00`}
                    />
                  ),
                )}
                {absoluteDay === firstDay && (
                  <div
                    className={styles.cursor}
                    style={{ top: `${dayRatio * 100}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
