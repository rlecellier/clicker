import { Meter } from '@base-ui/react/meter';

import { CALORIES_MAX_TARGET, CALORIES_MIN_TARGET } from '@game/nutrition';

import styles from './CaloriesGauge.module.css';

type CaloriesGaugeProps = {
  // gauge between 0 and 100
  calories: number;
  fat: number;
};

type Level = 'low' | 'balanced' | 'high';

const getLevel = (calories: number): Level => {
  if (calories < CALORIES_MIN_TARGET) return 'low';
  return calories > CALORIES_MAX_TARGET ? 'high' : 'balanced';
};

export const CaloriesGauge = ({ calories, fat }: CaloriesGaugeProps) => {
  const level = getLevel(calories);

  return (
    <Meter.Root
      value={calories}
      className={styles.root}
      aria-label="Calories"
      aria-valuetext={`${Math.round(calories)}%`}
    >
      <div className={styles.header}>
        <span className={styles.value} data-level={level}>
          {Math.round(calories)}%
        </span>
        <span className={styles.fat}>Fat {fat.toFixed(1)}</span>
      </div>
      <Meter.Track className={styles.track}>
        <div
          className={styles.zone}
          style={{
            left: `${CALORIES_MIN_TARGET}%`,
            width: `${CALORIES_MAX_TARGET - CALORIES_MIN_TARGET}%`,
          }}
        />
        <Meter.Indicator className={styles.indicator} data-level={level} />
      </Meter.Track>
    </Meter.Root>
  );
};
