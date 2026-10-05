import { Button } from '@base-ui/react/button';
import { Menu, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link, Outlet } from 'react-router';

import { AgeCounter } from '@component/AgeCounter';
import { CaloriesStatus } from '@component/CaloriesStatus';
import { GameClock } from '@component/GameClock';
import { MoneyCounter } from '@component/MoneyCounter';
import { Sidebar } from '@component/Sidebar';
import { GameProvider, useGameContext } from '@context/GameContext';
import { birthDateOf } from '@game/age';
import { newGameState } from '@game/gameState';
import { getCaloriesStatus } from '@game/nutrition';
import { readSave } from '@game/save';
import { gameStartOf, momentOf } from '@game/time';

import styles from './RootLayout.module.css';

const Layout = () => {
  const {
    age,
    coins,
    calories,
    body,
    brain,
    dreamGauge,
    dreams,
    elapsedHours,
    location,
    origin,
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
          <MoneyCounter coins={coins} />
          <GameClock {...momentOf(origin, elapsedHours)} />
          <CaloriesStatus status={getCaloriesStatus(calories)} />
          <AgeCounter years={age} />
        </div>
      </header>
      <div className={styles.body}>
        <Sidebar
          id="sidebar"
          calories={calories}
          body={body}
          brain={brain}
          dreamGauge={dreamGauge}
          dreams={dreams}
          location={location}
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onRestart={restart}
        />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const RootLayout = () => {
  // The saved game is read once, when the page opens.
  const [savedGame] = useState(
    () =>
      readSave(localStorage) ??
      (() => {
        // a new game starts at the date and time of the player
        const now = new Date();
        return newGameState({
          ...gameStartOf(now),
          birthDate: birthDateOf(now),
        });
      })(),
  );

  return (
    <GameProvider initialState={savedGame} persist>
      <Layout />
    </GameProvider>
  );
};
