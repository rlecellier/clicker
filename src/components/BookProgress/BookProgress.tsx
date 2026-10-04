import { Meter } from '@base-ui/react/meter';
import { BookOpen } from 'lucide-react';

import styles from './BookProgress.module.css';

type BookProgressProps = {
  title: string;
  // free-time hours read so far
  hoursRead: number;
  totalHours: number;
  isReading: boolean;
};

export const BookProgress = ({
  title,
  hoursRead,
  totalHours,
  isReading,
}: BookProgressProps) => {
  const percent = Math.floor((hoursRead / totalHours) * 100);

  return (
    <Meter.Root
      value={hoursRead}
      max={totalHours}
      className={styles.root}
      aria-label={title}
      aria-valuetext={`${percent}%`}
    >
      <div className={styles.header}>
        <span className={styles.value}>
          <BookOpen aria-hidden size={14} /> {percent}%
        </span>
        <span className={styles.hours}>
          {Math.floor(hoursRead)} / {totalHours} h
        </span>
      </div>
      <Meter.Track className={styles.track}>
        <Meter.Indicator
          className={styles.indicator}
          data-reading={isReading || undefined}
        />
      </Meter.Track>
    </Meter.Root>
  );
};
