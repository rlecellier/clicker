import styles from './MoneyCounter.module.css';

type MoneyCounterProps = {
  amount: number;
};

export function MoneyCounter({ amount }: MoneyCounterProps) {
  return <p className={styles.money}>${amount}</p>;
}
