import { Button } from '@base-ui/react/button';
import { Menu, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router';

import { CaloriesStatus } from '@component/CaloriesStatus';
import { GaugesPanel } from '@component/GaugesPanel';
import { MoneyCounter } from '@component/MoneyCounter';
import { TimeControls } from '@component/TimeControls';
import { GameProvider, useGameContext } from '@context/GameContext';
import { getCaloriesStatus } from '@game/nutrition';
import { readSave } from '@game/save';

import styles from './RootLayout.module.css';

const Layout = () => {
  const {
    balanceCents,
    calories,
    fat,
    brain,
    isSleeping,
    speed,
    canSpeedUp,
    canSlowDown,
    faster,
    slower,
  } = useGameContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Button
            className={styles.menuButton}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="gauges-panel"
            onClick={() => {
              setIsMenuOpen((isOpen) => !isOpen);
            }}
          >
            {isMenuOpen ? (
              <X aria-hidden size={18} />
            ) : (
              <Menu aria-hidden size={18} />
            )}
          </Button>
          <h1 className={styles.title}>Clicker</h1>
        </div>
        <GaugesPanel
          id="gauges-panel"
          calories={calories}
          fat={fat}
          brain={brain}
          isSleeping={isSleeping}
          isOpen={isMenuOpen}
          onClose={closeMenu}
        />
        <div className={styles.status}>
          <CaloriesStatus status={getCaloriesStatus(calories)} />
          <MoneyCounter cents={balanceCents} />
        </div>
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
