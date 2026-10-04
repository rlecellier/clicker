import { Meter } from '@base-ui/react/meter';
import { Brain, Moon } from 'lucide-react';

import { BRAIN_CAP } from '@game/sleep';

import styles from './BrainGauge.module.css';

type BrainGaugeProps = {
  // gauge between 0 and 100
  brain: number;
  isSleeping: boolean;
};

export const BrainGauge = ({ brain, isSleeping }: BrainGaugeProps) => {
  return (
    <Meter.Root
      value={brain}
      max={BRAIN_CAP}
      className={styles.root}
      aria-label="Brain"
      aria-valuetext={`${Math.round(brain)}%`}
    >
      <div className={styles.header}>
        <span className={styles.value}>
          <Brain aria-hidden size={14} /> {Math.round(brain)}%
        </span>
        {isSleeping && (
          <span className={styles.sleeping}>
            <Moon aria-hidden size={12} /> Asleep
          </span>
        )}
      </div>
      <Meter.Track className={styles.track}>
        <Meter.Indicator
          className={styles.indicator}
          data-sleeping={isSleeping || undefined}
        />
      </Meter.Track>
    </Meter.Root>
  );
};
