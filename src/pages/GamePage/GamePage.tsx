import { Button } from '@base-ui/react/button';
import { Cake, Cookie } from 'lucide-react';

import { LocationIndicator } from '@component/LocationIndicator';
import { PendingPay } from '@component/PendingPay';
import { ScheduleBanners } from '@component/ScheduleBanners';
import { useGameContext } from '@context/GameContext';
import { SNACK_CALORIES } from '@game/nutrition';

import styles from './GamePage.module.css';

export const GamePage = () => {
  const { pendingPayCents, isEarning, location, isEnjoyingCake, snack, cake } =
    useGameContext();

  return (
    <>
      <ScheduleBanners />
      <div className={styles.content}>
        <LocationIndicator location={location} />
        <PendingPay cents={pendingPayCents} isEarning={isEarning} />
        <div className={styles.actions}>
          <Button onClick={snack}>
            <Cookie aria-hidden size={18} /> Eat a snack (+{SNACK_CALORIES}%)
          </Button>
          <Button onClick={cake} disabled={isEnjoyingCake}>
            <Cake aria-hidden size={18} />{' '}
            {isEnjoyingCake ? 'Enjoying a cake…' : 'Enjoy a cake (30 min)'}
          </Button>
        </div>
      </div>
    </>
  );
};
