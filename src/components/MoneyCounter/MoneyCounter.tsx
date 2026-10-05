import { Coins } from 'lucide-react';

import { formatCoins } from '@game/coins';

import styles from './MoneyCounter.module.css';

type MoneyCounterProps = {
  // gold coins
  coins: number;
};

export const MoneyCounter = ({ coins }: MoneyCounterProps) => {
  return (
    <p className={styles.money} role="status" aria-label="Gold coins">
      <Coins aria-hidden size={22} className={styles.icon} />
      {formatCoins(coins)}
    </p>
  );
};
