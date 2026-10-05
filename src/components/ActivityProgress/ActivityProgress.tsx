import { Meter } from '@base-ui/react/meter';
import { Hourglass } from 'lucide-react';

import styles from './ActivityProgress.module.css';

type ActivityProgressProps = {
  // what the player is doing
  title: string;
  // how far it is, in game hours
  done: number;
  hours: number;
};

// The action in progress and how far it is.
export const ActivityProgress = ({
  title,
  done,
  hours,
}: ActivityProgressProps) => {
  const percent = Math.floor((done / hours) * 100);

  return (
    <Meter.Root
      value={done}
      max={hours}
      className={styles.root}
      aria-label="Action in progress"
      aria-valuetext={`${title}, ${percent}%`}
    >
      <div className={styles.header}>
        <span className={styles.value}>
          <Hourglass aria-hidden size={14} /> {title}
        </span>
        <span className={styles.percent}>{percent}%</span>
      </div>
      <Meter.Track className={styles.track}>
        <Meter.Indicator className={styles.indicator} />
      </Meter.Track>
    </Meter.Root>
  );
};
