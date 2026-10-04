import { Button } from '@base-ui/react/button';
import { Menu, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link, Outlet } from 'react-router';

import { AgeCounter } from '@component/AgeCounter';
import { AskPrompt } from '@component/AskPrompt';
import { CaloriesStatus } from '@component/CaloriesStatus';
import { Sidebar } from '@component/Sidebar';
import { TimeControls } from '@component/TimeControls';
import { GameProvider, useGameContext } from '@context/GameContext';
import { birthDateOf } from '@game/age';
import { newGameState } from '@game/gameState';
import { getCaloriesStatus } from '@game/nutrition';
import { readSave } from '@game/save';

import styles from './RootLayout.module.css';

const Layout = () => {
  const {
    age,
    balanceCents,
    calories,
    body,
    brain,
    dreamGauge,
    dreams,
    isSleeping,
    location,
    speed,
    canSpeedUp,
    canSlowDown,
    faster,
    slower,
    restart,
  } = useGameContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Button
            className={styles.menuButton}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="sidebar"
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
          <h1 className={styles.title}>
            <Link to="/" className={styles.titleLink}>
              Clicker
            </Link>
          </h1>
        </div>
        <div className={styles.status}>
          <CaloriesStatus status={getCaloriesStatus(calories)} />
          <AgeCounter years={age} />
        </div>
      </header>
      <div className={styles.body}>
        <Sidebar
          id="sidebar"
          balanceCents={balanceCents}
          calories={calories}
          body={body}
          brain={brain}
          dreamGauge={dreamGauge}
          dreams={dreams}
          isSleeping={isSleeping}
          location={location}
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onRestart={restart}
        />
        <main className={styles.main}>
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
        <AskPrompt />
      </div>
    </div>
  );
};

export const RootLayout = () => {
  // The saved game is read once, when the page opens.
  const [savedGame] = useState(
    () => readSave(localStorage) ?? newGameState(birthDateOf(new Date())),
  );

  return (
    <GameProvider initialState={savedGame} persist>
      <Layout />
    </GameProvider>
  );
};
