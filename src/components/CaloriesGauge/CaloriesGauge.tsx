import { Meter } from '@base-ui/react/meter';

import {
  CALORIES_MAX_TARGET,
  CALORIES_MIN_TARGET,
  getCaloriesStatus,
} from '@game/nutrition';

import styles from './CaloriesGauge.module.css';

type CaloriesGaugeProps = {
  // gauge between 0 and 100
  calories: number;
};

export const CaloriesGauge = ({ calories }: CaloriesGaugeProps) => {
  const status = getCaloriesStatus(calories);

  return (
    <Meter.Root
      value={calories}
      className={styles.root}
      aria-label="Calories"
      aria-valuetext={`${Math.round(calories)}%`}
    >
      <div className={styles.header}>
        <span className={styles.value} data-status={status}>
          {Math.round(calories)}%
        </span>
      </div>
      <Meter.Track className={styles.track}>
        <div
          className={styles.zone}
          style={{
            left: `${CALORIES_MIN_TARGET}%`,
            width: `${CALORIES_MAX_TARGET - CALORIES_MIN_TARGET}%`,
          }}
        />
        <Meter.Indicator className={styles.indicator} data-status={status} />
      </Meter.Track>
    </Meter.Root>
  );
};
