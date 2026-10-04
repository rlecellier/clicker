import { useEffect } from 'react';

import { BrainGauge } from '@component/BrainGauge';
import { CaloriesGauge } from '@component/CaloriesGauge';

import styles from './GaugesPanel.module.css';

type GaugesPanelProps = {
  id: string;
  calories: number;
  fat: number;
  brain: number;
  isSleeping: boolean;
  // only matters on mobile: from tablet up the panel is always in the header
  isOpen: boolean;
  onClose: () => void;
};

// The calories, fat and brain gauges: a sidebar on mobile, part of the header from
// tablet up.
export const GaugesPanel = ({
  id,
  calories,
  fat,
  brain,
  isSleeping,
  isOpen,
  onClose,
}: GaugesPanelProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={styles.backdrop}
        data-open={isOpen || undefined}
        onClick={onClose}
        aria-hidden
      />
      <aside id={id} className={styles.panel} data-open={isOpen || undefined}>
        <CaloriesGauge calories={calories} fat={fat} />
        <BrainGauge brain={brain} isSleeping={isSleeping} />
      </aside>
    </>
  );
};
