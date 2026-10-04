import { Meter } from '@base-ui/react/meter';

import type { Body } from '@game/body';

import styles from './BodyGauge.module.css';

type BodyGaugeProps = {
  fatPercent: Body['fatPercent'];
  musclePercent: Body['musclePercent'];
};

// The split of the body between fat and muscle: the bar is the fat share.
export const BodyGauge = ({ fatPercent, musclePercent }: BodyGaugeProps) => {
  const fat = Math.round(fatPercent);
  const muscle = Math.round(musclePercent);

  return (
    <Meter.Root
      value={fatPercent}
      className={styles.root}
      aria-label="Body"
      aria-valuetext={`${fat}% fat, ${muscle}% muscle`}
    >
      <div className={styles.header}>
        <span className={styles.fat}>Fat {fat}%</span>
        <span className={styles.muscle}>Muscle {muscle}%</span>
      </div>
      <Meter.Track className={styles.track}>
        <Meter.Indicator className={styles.indicator} />
      </Meter.Track>
    </Meter.Root>
  );
};
