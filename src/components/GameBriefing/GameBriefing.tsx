import { Button } from '@base-ui/react/button';

import { formatCoins } from '@game/coins';
import { selfMadeOf, type Gender } from '@game/gender';

import styles from './GameBriefing.module.css';

type GameBriefingProps = {
  // age of the player when the game starts
  age: number;
  // gold coins in the bank account when the game starts
  coins: number;
  gender: Gender;
  onStart: () => void;
};

export const GameBriefing = ({
  age,
  coins,
  gender,
  onStart,
}: GameBriefingProps) => {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Your story starts here</h1>
      <p>You are {age}. You are an adult now.</p>
      <p>
        You have <strong>{formatCoins(coins)} coins</strong> in your bank
        account, and your parents bought you a small apartment.
      </p>
      <p>It is up to you to show them you can be a {selfMadeOf(gender)}.</p>
      <Button onClick={onStart}>Start the game</Button>
    </main>
  );
};
