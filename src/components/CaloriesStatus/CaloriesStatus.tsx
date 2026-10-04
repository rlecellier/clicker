import { Popover } from '@base-ui/react/popover';
import { Carrot } from 'lucide-react';

import type { CaloriesStatus as Status } from '@game/nutrition';

import styles from './CaloriesStatus.module.css';

type CaloriesStatusProps = {
  status: Status;
};

const MESSAGES: Record<Status, { title: string; message: string }> = {
  starving: {
    title: 'Out of energy',
    message: 'You are running on empty. Eat something.',
  },
  'running-low': {
    title: 'Running low',
    message: 'You are going to run out of energy soon. Plan a snack.',
  },
  good: {
    title: 'Well fed',
    message: 'Your energy level is just right.',
  },
  'running-high': {
    title: 'Getting too much',
    message: 'You are going to have too much energy. Hold off on eating.',
  },
  overflowing: {
    title: 'Too much energy',
    message:
      'Your body is not using all your energy: the excess turns into fat.',
  },
};

// A carrot that is always there, colored like the calories state; clicking
// it says what the state means.
export const CaloriesStatus = ({ status }: CaloriesStatusProps) => {
  const { title, message } = MESSAGES[status];

  return (
    <Popover.Root>
      <Popover.Trigger
        className={styles.trigger}
        data-status={status}
        aria-label="Calories status"
      >
        <Carrot aria-hidden size={18} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          sideOffset={8}
          align="end"
          className={styles.positioner}
        >
          <Popover.Popup className={styles.popup} data-status={status}>
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
