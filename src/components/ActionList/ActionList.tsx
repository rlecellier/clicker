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
  // one row each: an action alone, or the choices of a group on one line
  rows: {
    key: string;
    // the name of the group, none for an action alone
    name?: string;
    kind: EventKind;
    options: {
      id: string;
      text: string;
      // what assistive technologies read
      label: string;
      // how long it takes, "30 min"
      duration: string;
      // why it cannot be done right now, if it cannot
      blocker?: string;
    }[];
  }[];
  onPerform: (id: string) => void;
};

// The actions of the place the player is at, one row each.
export const ActionList = ({ rows, onPerform }: ActionListProps) => {
  return (
    <ul className={styles.root} aria-label="Actions">
      {rows.map(({ key, name, kind, options }) => {
        const Icon = ICONS[kind];
        return (
          <li key={key} className={styles.row}>
            {name && (
              <span className={styles.name}>
                <Icon aria-hidden size={18} /> {name}
              </span>
            )}
            {options.map(({ id, text, label, duration, blocker }) => (
              <Button
                key={id}
                className={styles.action}
                aria-label={label}
                title={blocker ?? duration}
                disabled={blocker !== undefined}
                onClick={() => {
                  onPerform(id);
                }}
              >
                {!name && <Icon aria-hidden size={18} />}
                <span className={styles.label}>{text}</span>
                {!name && (
                  <span className={styles.detail}>{blocker ?? duration}</span>
                )}
              </Button>
            ))}
          </li>
        );
      })}
    </ul>
  );
};
