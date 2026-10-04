import { Popover } from '@base-ui/react/popover';
import { Bell } from 'lucide-react';

import { CALORIES_MAX_TARGET, CALORIES_MIN_TARGET } from '@game/nutrition';
import type { CaloriesLevel } from '@game/nutrition';

import styles from './CaloriesAlert.module.css';

type CaloriesAlertProps = {
  level: CaloriesLevel;
};

const ALERTS = {
  low: {
    title: 'Calories too low',
    message: `Below ${CALORIES_MIN_TARGET}%: the gauge is running empty. Eat a snack.`,
  },
  high: {
    title: 'Calories too high',
    message: `Above ${CALORIES_MAX_TARGET}%: the excess is turning into fat. Let it burn off.`,
  },
};

// A bell that only shows up when the calories are out of the range to keep,
// and says what is wrong in a dropdown.
export const CaloriesAlert = ({ level }: CaloriesAlertProps) => {
  if (level === 'balanced') return;
  const { title, message } = ALERTS[level];

  return (
    <Popover.Root>
      <Popover.Trigger
        className={styles.trigger}
        data-level={level}
        aria-label="Calories alert"
      >
        <Bell aria-hidden size={18} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          sideOffset={8}
          align="end"
          className={styles.positioner}
        >
          <Popover.Popup className={styles.popup} data-level={level}>
            <Popover.Title className={styles.title}>{title}</Popover.Title>
            <Popover.Description className={styles.message}>
              {message}
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};
