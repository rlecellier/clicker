import styles from './GameClock.module.css';

type GameClockProps = {
  // "Mon 1 Oct 2026"
  date: string;
  // "14:30"
  time: string;
};

// The date and time of the game, which only move when the player acts.
export const GameClock = ({ date, time }: GameClockProps) => {
  return (
    <p className={styles.root} role="timer" aria-label="Game time">
      <span className={styles.date}>{date}</span>
      <span className={styles.time}>{time}</span>
    </p>
  );
};
