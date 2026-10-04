import { BodyGauge } from '@component/BodyGauge';
import { BrainGauge } from '@component/BrainGauge';
import { GaugeList } from '@component/GaugeList';
import { useGameContext } from '@context/GameContext';
import { formatBirthDate, formatLifeTime, lifeTimeAt } from '@game/age';
import { formatMoney } from '@game/money';

import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const {
    age,
    balanceCents,
    birthDate,
    elapsedHours,
    dreams,
    body,
    brain,
    isSleeping,
  } = useGameContext();

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Profile</h2>
      <dl className={styles.stats}>
        <div>
          <dt>Age</dt>
          <dd>{age} years</dd>
        </div>
        <div>
          <dt>Born</dt>
          <dd>{formatBirthDate(birthDate)}</dd>
        </div>
        <div>
          <dt>Played</dt>
          <dd>{formatLifeTime(lifeTimeAt(elapsedHours))}</dd>
        </div>
        <div>
          <dt>Cash</dt>
          <dd>{formatMoney(balanceCents)}</dd>
        </div>
        <div>
          <dt>Dreams</dt>
          <dd>{dreams}</dd>
        </div>
        <div>
          <dt>Height</dt>
          <dd>{(body.heightCm / 100).toFixed(2)} m</dd>
        </div>
        <div>
          <dt>Weight</dt>
          <dd>{body.weightKg.toFixed(1)} kg</dd>
        </div>
      </dl>
      <GaugeList>
        <BrainGauge size="full" brain={brain} isSleeping={isSleeping} />
        <BodyGauge
          size="full"
          fatPercent={body.fatPercent}
          musclePercent={body.musclePercent}
        />
      </GaugeList>
    </section>
  );
};
