import { Slider } from '@base-ui/react/slider';
import { cva, type VariantProps } from 'class-variance-authority';

import type { Body } from '@game/body';

import styles from './BodyGauge.module.css';

const bodyGauge = cva('', {
  variants: {
    // compact lives in the sidebar, full takes the width of its container
    size: {
      compact: styles.compact,
      full: styles.full,
    },
  },
  defaultVariants: { size: 'compact' },
});

type BodyGaugeProps = VariantProps<typeof bodyGauge> & {
  fatPercent: Body['fatPercent'];
  musclePercent: Body['musclePercent'];
};

// The split of the body between fat and muscle on a read-only slider: the
// thumb sits at the fat share.
export const BodyGauge = ({
  fatPercent,
  musclePercent,
  size,
}: BodyGaugeProps) => {
  const fat = Math.round(fatPercent);
  const muscle = Math.round(musclePercent);

  return (
    <Slider.Root
      value={fatPercent}
      min={0}
      max={100}
      disabled
      thumbAlignment="edge"
      className={bodyGauge({ size })}
    >
      <div className={styles.header}>
        <span className={styles.fat}>Fat {fat}%</span>
        <span className={styles.muscle}>Muscle {muscle}%</span>
      </div>
      <Slider.Control className={styles.control}>
        <Slider.Track className={styles.track}>
          <Slider.Indicator className={styles.indicator} />
          <Slider.Thumb
            className={styles.thumb}
            aria-label="Body fat"
            getAriaValueText={() => `${fat}% fat, ${muscle}% muscle`}
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
};
