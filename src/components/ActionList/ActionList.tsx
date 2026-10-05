import { Button } from '@base-ui/react/button';
import {
  BookOpen,
  Briefcase,
  Moon,
  Utensils,
  type LucideIcon,
} from 'lucide-react';

import type { EventKind } from '@game/history';

import styles from './ActionList.module.css';

const ICONS: Record<EventKind, LucideIcon> = {
  work: Briefcase,
  meal: Utensils,
  sleep: Moon,
  read: BookOpen,
  search: Briefcase,
};

type ActionListProps = {
  actions: {
    id: string;
    label: string;
    kind: EventKind;
    // how long it takes, "30 min"
    duration: string;
    // why it cannot be done right now, if it cannot
    blocker?: string;
  }[];
  onPerform: (id: string) => void;
};

// The actions of the place the player is at, one button each.
export const ActionList = ({ actions, onPerform }: ActionListProps) => {
  return (
    <ul className={styles.root} aria-label="Actions">
      {actions.map(({ id, label, kind, duration, blocker }) => {
        const Icon = ICONS[kind];
        return (
          <li key={id}>
            <Button
              className={styles.action}
              disabled={blocker !== undefined}
              onClick={() => {
                onPerform(id);
              }}
            >
              <Icon aria-hidden size={18} />
              <span className={styles.label}>{label}</span>
              <span className={styles.detail}>{blocker ?? duration}</span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
};
