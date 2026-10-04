import { useState } from 'react';
import { Outlet } from 'react-router';

import { GameProvider } from '@context/GameContext';
import { readSave } from '@game/save';

import styles from './RootLayout.module.css';

export const RootLayout = () => {
  // The saved game is read once, when the page opens.
  const [savedGame] = useState(() => readSave(localStorage));

  return (
    <GameProvider initialState={savedGame} persist>
      <main className={styles.main}>
        <h1>Clicker</h1>
        <Outlet />
      </main>
    </GameProvider>
  );
};
