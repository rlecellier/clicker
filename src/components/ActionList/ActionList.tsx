import { Button } from '@base-ui/react/button';
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  Lightbulb,
  Moon,
  ShoppingCart,
  Utensils,
  type LucideIcon,
} from 'lucide-react';

import { IconRow } from '@component/IconRow';
import type { EventKind } from '@game/history';

import styles from './ActionList.module.css';

const ICONS: Record<EventKind, LucideIcon> = {
  work: Briefcase,
  meal: Utensils,
  sleep: Moon,
  read: BookOpen,
  search: Briefcase,
  think: Lightbulb,
  shopping: ShoppingCart,
};

type ActionListProps = {
  // one row each: an action alone, or a group of choices (a select and a button)
  rows: {
    key: string;
    // the name of the group, none for an action alone
    name?: string;
    // the id of the option chosen in a group
    selected?: string;
    kind: EventKind;
    options: {
      id: string;
      text: string;
      // what assistive technologies read
      label: string;
      // how long it takes and what it costs, "1h · 8 coins"
      detail: string;
      // why it cannot be done right now, if it cannot
      blocker?: string;
    }[];
  }[];
  onPerform: (id: string) => void;
  // choose an option of a group
  onPick: (key: string, id: string) => void;
};

// The actions of the place the player is at, one row each.
export const ActionList = ({ rows, onPerform, onPick }: ActionListProps) => {
  return (
    <ul className={styles.root} aria-label="Actions">
      {rows.map(({ key, name, selected, kind, options }) => {
        const Icon = ICONS[kind];
        const first = options[0];
        if (!first) return;
        if (name) {
          // a group: choose an option, then do it
          const chosen = options.find(({ id }) => id === selected) ?? first;
          return (
            <li key={key}>
              <IconRow icon={Icon}>
                <div className={styles.field}>
                  <select
                    className={styles.select}
                    aria-label={`${name} choice`}
                    value={chosen.id}
                    onChange={(event) => {
                      onPick(key, event.target.value);
                    }}
                  >
                    {options.map(({ id, text }) => (
                      <option key={id} value={id}>
                        {text}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden
                    size={18}
                    className={styles.chevron}
                  />
                </div>
                <Button
                  className={styles.go}
                  title={chosen.blocker ?? chosen.detail}
                  disabled={chosen.blocker !== undefined}
                  onClick={() => {
                    onPerform(chosen.id);
                  }}
                >
                  {name}
                </Button>
              </IconRow>
            </li>
          );
        }
        const { id, label, detail, blocker, text } = first;
        return (
          <li key={key}>
            <IconRow icon={Icon}>
              <Button
                className={styles.action}
                aria-label={label}
                title={blocker ?? detail}
                disabled={blocker !== undefined}
                onClick={() => {
                  onPerform(id);
                }}
              >
                <span className={styles.label}>{text}</span>
                <span className={styles.detail}>{blocker ?? detail}</span>
              </Button>
            </IconRow>
          </li>
        );
      })}
    </ul>
  );
};
