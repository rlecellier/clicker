import { Meter } from '@base-ui/react/meter';
import { Sparkles } from 'lucide-react';

import { DREAM_CAP } from '@game/sleep';

import styles from './DreamGauge.module.css';

type DreamGaugeProps = {
  // gauge between 0 and 100: a dream is made each time it is full
  dreamGauge: number;
  // dreams made so far
  dreams: number;
};

export const DreamGauge = ({ dreamGauge, dreams }: DreamGaugeProps) => {
  return (
    <Meter.Root
      value={dreamGauge}
      max={DREAM_CAP}
      className={styles.root}
      aria-label="Dream"
      aria-valuetext={`${Math.round(dreamGauge)}%`}
    >
      <div className={styles.header}>
        <span className={styles.value}>
          <Sparkles aria-hidden size={14} /> {Math.round(dreamGauge)}%
        </span>
        <span className={styles.count}>
          {dreams} {dreams === 1 ? 'dream' : 'dreams'}
        </span>
      </div>
      <Meter.Track className={styles.track}>
        <Meter.Indicator className={styles.indicator} />
      </Meter.Track>
    </Meter.Root>
  );
};
