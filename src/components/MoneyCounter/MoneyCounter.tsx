import { formatMoney } from '@game/money';

import styles from './MoneyCounter.module.css';

type MoneyCounterProps = {
  // integer cents
  cents: number;
};

export const MoneyCounter = ({ cents }: MoneyCounterProps) => {
  return <p className={styles.money}>{formatMoney(cents)}</p>;
};
