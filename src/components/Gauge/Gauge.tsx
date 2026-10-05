import { Meter } from '@base-ui/react/meter';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import styles from './Gauge.module.css';

const gauge = cva(styles.root, {
  variants: {
    // compact lives in the sidebar, full in a page
    size: {
      compact: styles.compact,
      full: styles.full,
    },
    // on a phone, the title, the bar and the detail share a single line
    inline: {
      true: styles.inline,
    },
    tone: {
      accent: styles.accent,
      success: styles.success,
      sleep: styles.sleep,
    },
  },
  defaultVariants: { size: 'compact', tone: 'accent' },
});

type GaugeProps = VariantProps<typeof gauge> & {
  value: number;
  max: number;
  // accessible name and value of the meter
  label: string;
  valueText: string;
  // above the bar: the value on the left, a detail on the right
  title: ReactNode;
  detail?: ReactNode;
};

// A labelled bar, shared by the gauges of the sidebar and the progress of the
// game page.
export const Gauge = ({
  value,
  max,
  label,
  valueText,
  title,
  detail,
  size,
  tone,
  inline,
}: GaugeProps) => (
  <Meter.Root
    value={value}
    max={max}
    className={gauge({ size, tone, inline })}
    aria-label={label}
    aria-valuetext={valueText}
  >
    <div className={styles.header}>
      <span className={styles.title}>{title}</span>
      {detail !== undefined && <span className={styles.detail}>{detail}</span>}
    </div>
    <Meter.Track className={styles.track}>
      <Meter.Indicator className={styles.indicator} />
    </Meter.Track>
  </Meter.Root>
);
