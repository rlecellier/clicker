import { Button } from '@base-ui/react/button';
import { Plus } from 'lucide-react';

import {
  ACTIVITIES,
  REPEATS,
  type ActivityId,
  type EventDraftText,
  type EventMode,
  type Repeat,
} from '@game/calendar';

import styles from './AddEventForm.module.css';

type AddEventFormProps = {
  // what the player picked so far, the times as "HH:MM"
  values: EventDraftText;
  // what a single event is said to happen on, e.g. "Wed 3 Feb"
  dayLabel: string;
  // why the event cannot be added yet
  problem?: string;
  onChange: (patch: Partial<EventDraftText>) => void;
  onSubmit: () => void;
};

const MODES: { id: EventMode; label: string }[] = [
  { id: 'auto', label: 'Start automatically' },
  { id: 'ask', label: 'Ask me first' },
];

// The fields to plan a new event: what, when, how often, and whether it starts
// by itself or asks first.
export const AddEventForm = ({
  values,
  dayLabel,
  problem,
  onChange,
  onSubmit,
}: AddEventFormProps) => {
  return (
    <form
      className={styles.root}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className={styles.field}>
        Activity
        <select
          value={values.activity}
          onChange={(event) => {
            onChange({ activity: event.target.value as ActivityId });
          }}
        >
          {ACTIVITIES.map(({ id, title }) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>
      </label>
      <div className={styles.times}>
        <label className={styles.field}>
          From
          <input
            type="time"
            step={1800}
            required
            value={values.start}
            onChange={(event) => {
              onChange({ start: event.target.value });
            }}
          />
        </label>
        <label className={styles.field}>
          To
          <input
            type="time"
            step={1800}
            required
            value={values.end}
            onChange={(event) => {
              onChange({ end: event.target.value });
            }}
          />
        </label>
      </div>
      <label className={styles.field}>
        Repeat
        <select
          value={values.repeat}
          onChange={(event) => {
            onChange({ repeat: event.target.value as Repeat });
          }}
        >
          {REPEATS.map(({ id, label }) => (
            <option key={id} value={id}>
              {id === 'once' ? `${label} (${dayLabel})` : label}
            </option>
          ))}
        </select>
      </label>
      <fieldset className={styles.modes}>
        <legend>When it starts</legend>
        {MODES.map(({ id, label }) => (
          <label key={id} className={styles.mode}>
            <input
              type="radio"
              name="mode"
              checked={values.mode === id}
              onChange={() => {
                onChange({ mode: id });
              }}
            />
            {label}
          </label>
        ))}
      </fieldset>
      {problem && (
        <p className={styles.problem} role="alert">
          {problem}
        </p>
      )}
      <Button type="submit" disabled={problem !== undefined}>
        <Plus aria-hidden size={18} /> Add to my plan
      </Button>
    </form>
  );
};
