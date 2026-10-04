import { useState } from 'react';
import { Outlet } from 'react-router';

import { MoneyCounter } from '@component/MoneyCounter';
import { TimeControls } from '@component/TimeControls';
import { GameProvider, useGameContext } from '@context/GameContext';
import { readSave } from '@game/save';

import styles from './RootLayout.module.css';

const Layout = () => {
  const { balanceCents, speed, canSpeedUp, canSlowDown, faster, slower } =
    useGameContext();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Clicker</h1>
        <MoneyCounter cents={balanceCents} />
      </header>
      <div className={styles.controls}>
        <TimeControls
          speed={speed}
          canSpeedUp={canSpeedUp}
          canSlowDown={canSlowDown}
          onFaster={faster}
          onSlower={slower}
        />
      </div>
      <Outlet />
    </main>
  );
};

export const RootLayout = () => {
  // The saved game is read once, when the page opens.
  const [savedGame] = useState(() => readSave(localStorage));

  return (
    <GameProvider initialState={savedGame} persist>
      <Layout />
    </GameProvider>
  );
};
