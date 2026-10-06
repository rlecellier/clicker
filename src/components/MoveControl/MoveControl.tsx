import { Button } from '@base-ui/react/button';
import { ChevronDown, MapPin } from 'lucide-react';

import { IconRow } from '@component/IconRow';

import styles from './MoveControl.module.css';

type MoveControlProps = {
  destinations: { id: string; label: string }[];
  // the id of the chosen destination
  value: string;
  // one thing at a time
  disabled: boolean;
  onChange: (id: string) => void;
  onGo: () => void;
};

// Choose where to go, then go.
export const MoveControl = ({
  destinations,
  value,
  disabled,
  onChange,
  onGo,
}: MoveControlProps) => {
  return (
    <div role="group" aria-label="Move">
      <IconRow icon={MapPin}>
        <div className={styles.field}>
          <select
            className={styles.select}
            aria-label="Destination"
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
          >
            {destinations.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden size={18} className={styles.chevron} />
        </div>
        <Button className={styles.go} disabled={disabled} onClick={onGo}>
          Go
        </Button>
      </IconRow>
    </div>
  );
};
