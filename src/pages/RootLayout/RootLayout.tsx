import { Outlet } from 'react-router';

import { GameProvider } from '@context/GameContext';

import styles from './RootLayout.module.css';

export const RootLayout = () => {
  return (
    <GameProvider>
      <main className={styles.main}>
        <h1>Clicker</h1>
        <Outlet />
      </main>
    </GameProvider>
  );
};
