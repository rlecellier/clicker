import styles from './AgeCounter.module.css';

type AgeCounterProps = {
  // whole years
  years: number;
};

export const AgeCounter = ({ years }: AgeCounterProps) => {
  return (
    <p className={styles.age}>
      {years} {years === 1 ? 'year' : 'years'} old
    </p>
  );
};
