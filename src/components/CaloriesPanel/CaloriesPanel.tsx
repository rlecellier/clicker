import { useEffect } from 'react';

import { CaloriesGauge } from '@component/CaloriesGauge';

import styles from './CaloriesPanel.module.css';

type CaloriesPanelProps = {
  id: string;
  calories: number;
  fat: number;
  // only matters on mobile: from tablet up the panel is always in the header
  isOpen: boolean;
  onClose: () => void;
};

// The calories and fat gauge: a sidebar on mobile, part of the header from
// tablet up.
export const CaloriesPanel = ({
  id,
  calories,
  fat,
  isOpen,
  onClose,
}: CaloriesPanelProps) => {
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
      </aside>
    </>
  );
};
