import { Outlet } from 'react-router';

import { useGame } from '@hook/useGame';

import styles from './RootLayout.module.css';

export const RootLayout = () => {
  const game = useGame();

  return (
    <main className={styles.main}>
      <h1>Clicker</h1>
      <Outlet context={game} />
    </main>
  );
};
