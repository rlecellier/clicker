import { Coins } from 'lucide-react';

import styles from './PendingPay.module.css';

type PendingPayProps = {
  amount: number;
  // true while a work event is running
  isEarning: boolean;
};

export const PendingPay = ({ amount, isEarning }: PendingPayProps) => {
  return (
    <p className={styles.root} data-earning={isEarning || undefined}>
      <Coins aria-hidden size={18} className={styles.icon} />
      <span className={styles.amount}>+${amount.toFixed(2)}</span>
      <span className={styles.caption}>
        {isEarning ? 'earning, paid on Sunday night' : 'pay of the week'}
      </span>
    </p>
  );
};
