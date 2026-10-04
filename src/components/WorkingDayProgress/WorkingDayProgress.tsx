import { Progress } from '@base-ui/react/progress';

import styles from './WorkingDayProgress.module.css';

type WorkingDayProgressProps = {
  // ratio between 0 and 1
  progress: number;
};

export function WorkingDayProgress({ progress }: WorkingDayProgressProps) {
  return (
    <Progress.Root value={progress * 100} className={styles.root}>
      <Progress.Track className={styles.track}>
        <Progress.Indicator className={styles.indicator} />
      </Progress.Track>
    </Progress.Root>
  );
}
