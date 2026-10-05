import { Briefcase } from 'lucide-react';

import styles from './JobStatus.module.css';

type JobStatusProps = {
  // what the player does for a living, "Clothes seller"
  title: string;
  // what the job pays, "10 coins / hour"
  pay: string;
  // the shift the player is in, or the next one to come
  shift: string;
};

export const JobStatus = ({ title, pay, shift }: JobStatusProps) => {
  return (
    <section className={styles.root} aria-label="Job">
      <Briefcase aria-hidden size={20} className={styles.icon} />
      <div>
        <h2 className={styles.title}>
          {title} <span className={styles.pay}>{pay}</span>
        </h2>
        <p className={styles.shift}>{shift}</p>
      </div>
    </section>
  );
};
