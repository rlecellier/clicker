import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';

import { ActionList } from '@component/ActionList';
import { PlaceBanner } from '@component/PlaceBanner';
import { QueueList } from '@component/QueueList';
import { useGameContext } from '@context/GameContext';
import { isLocation } from '@game/location';
import { usePlaceActions } from '@hook/usePlaceActions';
import { useQueue } from '@hook/useQueue';

import styles from './PlacePage.module.css';

export const PlacePage = () => {
  const { place } = useParams();
  const { location } = useGameContext();
  const { rows, perform } = usePlaceActions(isLocation(place) ? place : 'home');
  const queue = useQueue();

  if (!isLocation(place)) {
    // the route loader already answered 404: this only narrows the type
    return;
  }

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Places</h2>
      <Link to="/places" className={styles.back}>
        <ArrowLeft aria-hidden size={16} />
        All places
      </Link>
      <PlaceBanner place={place} location={location} />
      <ActionList rows={rows} onPerform={perform} />
      <QueueList items={queue.items} onRemove={queue.remove} />
    </div>
  );
};
