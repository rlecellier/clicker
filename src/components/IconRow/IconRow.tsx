import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import styles from './IconRow.module.css';

const ICON_SIZE = 18;

type IconRowProps = {
  // shown left of the content, never inside it; without one the slot stays
  // empty so the content lines up with the other rows
  icon?: LucideIcon;
  children: ReactNode;
};

// One line of the page: an icon slot of a fixed width, then the content.
export const IconRow = ({ icon: Icon, children }: IconRowProps) => (
  <div className={styles.root}>
    <span className={styles.icon} style={{ inlineSize: ICON_SIZE }}>
      {Icon && <Icon aria-hidden size={ICON_SIZE} />}
    </span>
    {children}
  </div>
);
