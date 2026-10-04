import styles from './MoneyCounter.module.css';

type MoneyCounterProps = {
  amount: number;
};

export const MoneyCounter = ({ amount }: MoneyCounterProps) => {
  return <p className={styles.money}>${amount}</p>;
};
