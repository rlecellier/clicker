import { Button } from '@base-ui/react/button';
import { CalendarCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { CalendarGrid } from '@component/CalendarGrid';
import { useGameContext } from '@context/GameContext';
import { useCalendarDay } from '@hook/useCalendarDay';
import { useMediaQuery } from '@hook/useMediaQuery';
import { useSwipe } from '@hook/useSwipe';
import { useZoom } from '@hook/useZoom';
import { DAYS_PER_WEEK, HOURS_PER_DAY } from '@game/time';

import { rangeLabel, visibleDays, type CalendarView } from './calendarRange';
import styles from './CalendarPage.module.css';

const VIEWS: { view: CalendarView; label: string }[] = [
  { view: 'day', label: 'Day' },
  { view: 'week', label: 'Week' },
];

// The days of the game, starting on the current one and free to browse: a week at once on a large screen (or a single day if
// chosen), a single day on mobile, with a swipe to go to the next one. The
// whole day fits the screen; ctrl + wheel or a pinch zooms in on the hours.
export const CalendarPage = () => {
  const { week, weekHour, origin, history, job } = useGameContext();
  const currentDay =
    week * DAYS_PER_WEEK + Math.floor(weekHour / HOURS_PER_DAY);
  const dayRatio = (weekHour % HOURS_PER_DAY) / HOURS_PER_DAY;

  const { selectedDay, isOnToday, move, goToToday } =
    useCalendarDay(currentDay);
  const [chosenView, setChosenView] = useState<CalendarView>('week');
  // the view toggle only exists from tablet up: mobile always shows one day
  const isLargeScreen = useMediaQuery('(min-width: 640px)');
  const view = isLargeScreen ? chosenView : 'day';

  const { ref: scroller, zoom } = useZoom<HTMLDivElement>();

  const days = visibleDays(selectedDay, view);
  const unit = view === 'week' ? 'week' : 'day';
  const step = view === 'week' ? DAYS_PER_WEEK : 1;

  const swipe = useSwipe({
    onSwipeLeft: () => {
      move(step);
    },
    onSwipeRight: () => {
      move(-step);
    },
  });

  return (
    <section className={styles.root} aria-label="Calendar">
      <header className={styles.toolbar}>
        <div className={styles.navigation}>
          <Button
            aria-label={`Previous ${unit}`}
            onClick={() => {
              move(-step);
            }}
            disabled={days[0] === 0}
          >
            <ChevronLeft aria-hidden size={18} />
          </Button>
          <h2 className={styles.title}>{rangeLabel(origin, days)}</h2>
          <Button
            aria-label={`Next ${unit}`}
            onClick={() => {
              move(step);
            }}
          >
            <ChevronRight aria-hidden size={18} />
          </Button>
        </div>
        <div className={styles.actions}>
          <Button aria-label="Today" onClick={goToToday} disabled={isOnToday}>
            <CalendarCheck aria-hidden size={18} />
          </Button>
          {isLargeScreen && (
            <div role="group" aria-label="View" className={styles.views}>
              {VIEWS.map(({ view: option, label }) => (
                <Button
                  key={option}
                  aria-pressed={view === option}
                  onClick={() => {
                    setChosenView(option);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </header>
      <div className={styles.grid} ref={scroller} {...swipe}>
        <CalendarGrid
          origin={origin}
          days={days}
          history={history}
          job={job}
          currentDay={currentDay}
          dayRatio={dayRatio}
          zoom={zoom}
        />
      </div>
    </section>
  );
};
