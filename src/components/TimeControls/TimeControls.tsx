import { Button } from '@base-ui/react/button';
import { Minus, Plus } from 'lucide-react';

import styles from './TimeControls.module.css';

type TimeControlsProps = {
  speed: number;
  canSpeedUp: boolean;
  canSlowDown: boolean;
  onFaster: () => void;
  onSlower: () => void;
};

// Debug helper to speed up or slow down the game time.
export const TimeControls = ({
  speed,
  canSpeedUp,
  canSlowDown,
  onFaster,
  onSlower,
}: TimeControlsProps) => {
  return (
    <div className={styles.root}>
      <Button
        aria-label="Slow down time"
        onClick={onSlower}
        disabled={!canSlowDown}
      >
        <Minus aria-hidden size={16} />
      </Button>
      <output className={styles.speed} aria-label="Time speed">
        ×{speed}
      </output>
      <Button
        aria-label="Speed up time"
        onClick={onFaster}
        disabled={!canSpeedUp}
      >
        <Plus aria-hidden size={16} />
      </Button>
    </div>
  );
};
