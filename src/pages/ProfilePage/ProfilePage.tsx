import { BodyGauge } from '@component/BodyGauge';
import { BrainGauge } from '@component/BrainGauge';
import { useGameContext } from '@context/GameContext';

import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const { dreams, body, brain, isSleeping } = useGameContext();

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Profile</h2>
      <dl className={styles.stats}>
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
      <BrainGauge brain={brain} isSleeping={isSleeping} />
      <BodyGauge
        size="full"
        fatPercent={body.fatPercent}
        musclePercent={body.musclePercent}
      />
    </section>
  );
};
