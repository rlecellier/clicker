import type { ReactNode } from 'react';

import styles from './StatSheet.module.css';

type StatSheetProps = {
  stats: { label: string; value: ReactNode }[];
};

// label ... value lines, in as many columns as the width allows.
export const StatSheet = ({ stats }: StatSheetProps) => (
  <dl className={styles.stats}>
    {stats.map(({ label, value }) => (
      <div key={label} className={styles.stat}>
        <dt className={styles.label}>{label}</dt>
        <dd className={styles.value}>{value}</dd>
      </div>
    ))}
  </dl>
);
