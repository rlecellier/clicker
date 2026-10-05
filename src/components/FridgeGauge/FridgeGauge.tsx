import { Meter } from '@base-ui/react/meter';
import { Refrigerator } from 'lucide-react';

import { FRIDGE_MAX } from '@game/fridge';

import styles from './FridgeGauge.module.css';

type FridgeGaugeProps = {
  // portions left, between 0 and FRIDGE_MAX
  fridge: number;
};

export const FridgeGauge = ({ fridge }: FridgeGaugeProps) => {
  return (
    <Meter.Root
      value={fridge}
      max={FRIDGE_MAX}
      className={styles.root}
      aria-label="Fridge"
      aria-valuetext={`${fridge} / ${FRIDGE_MAX}`}
    >
      <div className={styles.header}>
        <span className={styles.value}>
          <Refrigerator aria-hidden size={14} /> {fridge} / {FRIDGE_MAX}
        </span>
      </div>
      <Meter.Track className={styles.track}>
        <Meter.Indicator className={styles.indicator} />
      </Meter.Track>
    </Meter.Root>
  );
};
