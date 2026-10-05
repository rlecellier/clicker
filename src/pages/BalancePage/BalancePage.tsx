import { useGameContext } from '@context/GameContext';
import { formatCoins } from '@game/coins';
import { hoursDone } from '@game/history';
import { JOBS } from '@game/jobs';
import { formatDuration } from '@game/time';

import styles from './BalancePage.module.css';

export const BalancePage = () => {
  const { coins, history, job } = useGameContext();
  const hourlyCoins = job ? JOBS[job.id].hourlyCoins : 0;
  const workedHours = hoursDone(history, 'work');

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Balance</h2>
      <dl className={styles.summary}>
        <div>
          <dt>Gold coins</dt>
          <dd>{formatCoins(coins)}</dd>
        </div>
        <div>
          <dt>Earned at work</dt>
          <dd className={styles.income}>
            {formatCoins(workedHours * hourlyCoins)}
          </dd>
        </div>
        <div>
          <dt>Time worked</dt>
          <dd>{workedHours === 0 ? '0h' : formatDuration(workedHours)}</dd>
        </div>
        <div>
          <dt>Pay</dt>
          <dd>{job ? `${hourlyCoins} coins / hour` : 'No job'}</dd>
        </div>
      </dl>
      <p className={styles.note}>
        Pay lands in your pocket with every half hour you work. Nothing to pay
        for yet: the flat has no rent and the meals are free.
      </p>
    </section>
  );
};
