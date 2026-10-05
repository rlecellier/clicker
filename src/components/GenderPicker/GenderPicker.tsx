import { Button } from '@base-ui/react/button';

import type { Gender } from '@game/gender';

import styles from './GenderPicker.module.css';

type GenderPickerProps = {
  onPick: (gender: Gender) => void;
};

export const GenderPicker = ({ onPick }: GenderPickerProps) => {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Who are you?</h1>
      <div className={styles.choices}>
        <Button onClick={() => onPick('boy')}>A boy</Button>
        <Button onClick={() => onPick('girl')}>A girl</Button>
      </div>
    </main>
  );
};
