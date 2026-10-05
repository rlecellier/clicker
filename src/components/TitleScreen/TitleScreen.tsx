import { Button } from '@base-ui/react/button';

import styles from './TitleScreen.module.css';

type TitleScreenProps = {
  onNewGame: () => void;
};

export const TitleScreen = ({ onNewGame }: TitleScreenProps) => {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Clicker</h1>
      <Button onClick={onNewGame}>New Game</Button>
    </main>
  );
};
