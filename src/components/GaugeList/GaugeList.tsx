import type { ReactNode } from 'react';

import styles from './GaugeList.module.css';

type GaugeListProps = {
  children: ReactNode;
};

// Stacks full-size gauges one under the other.
export const GaugeList = ({ children }: GaugeListProps) => (
  <div className={styles.root}>{children}</div>
);
