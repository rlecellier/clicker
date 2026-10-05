import { BodyGauge } from '@component/BodyGauge';
import { BrainGauge } from '@component/BrainGauge';
import { GaugeList } from '@component/GaugeList';
import { StatSheet } from '@component/StatSheet';
import { useGameContext } from '@context/GameContext';
import { formatBirthDate, formatLifeTime, lifeTimeAt } from '@game/age';
import { formatCoins } from '@game/coins';

import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const { age, coins, birthDate, playedHours, dreams, body, brain } =
    useGameContext();

  return (
    <section>
      <h2 className={styles.title}>Profile</h2>
      <StatSheet
        stats={[
          { label: 'Age', value: `${age} years` },
          { label: 'Born', value: formatBirthDate(birthDate) },
          { label: 'Played', value: formatLifeTime(lifeTimeAt(playedHours)) },
          { label: 'Height', value: `${(body.heightCm / 100).toFixed(2)} m` },
          { label: 'Weight', value: `${body.weightKg.toFixed(1)} kg` },
          { label: 'Gold coins', value: formatCoins(coins) },
          { label: 'Dreams', value: dreams },
        ]}
      />
      <GaugeList>
        <BrainGauge size="full" brain={brain} />
        <BodyGauge
          size="full"
          fatPercent={body.fatPercent}
          musclePercent={body.musclePercent}
        />
      </GaugeList>
    </section>
  );
};
