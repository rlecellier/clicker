import type { EventKind } from '@game/calendar';

import styles from './TaskBanner.module.css';

type TaskBannerProps = {
  // what the banner stands for, e.g. "Now" or "Next"
  label: string;
  title: string;
  kind: EventKind | 'free';
  detail: string;
};

export const TaskBanner = ({ label, title, kind, detail }: TaskBannerProps) => {
  return (
    <section className={styles.root} data-kind={kind} aria-label={label}>
      <span className={styles.label}>{label}</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.detail}>{detail}</p>
    </section>
  );
};
