import { Coins } from 'lucide-react';

import { formatMoney } from '@game/money';

import styles from './PendingPay.module.css';

type PendingPayProps = {
  // integer cents
  cents: number;
  // true while a work event is running
  isEarning: boolean;
};

export const PendingPay = ({ cents, isEarning }: PendingPayProps) => {
  return (
    <p className={styles.root} data-earning={isEarning || undefined}>
      <Coins aria-hidden size={18} className={styles.icon} />
      <span className={styles.amount}>
        +{formatMoney(cents, { alwaysCents: true })}
      </span>
      <span className={styles.caption}>
        {isEarning ? 'earning, paid on Sunday night' : 'pay of the week'}
      </span>
    </p>
  );
};
