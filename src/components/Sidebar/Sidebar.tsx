import {
  CalendarDays,
  ChevronDown,
  MapPin,
  User,
  Utensils,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';

import { BodyGauge } from '@component/BodyGauge';
import { BrainGauge } from '@component/BrainGauge';
import { CaloriesGauge } from '@component/CaloriesGauge';
import { DreamGauge } from '@component/DreamGauge';
import { PLACES } from '@component/PlaceInfo';
import type { Body } from '@game/body';
import { LOCATIONS, type Location } from '@game/location';

import styles from './Sidebar.module.css';

type SidebarProps = {
  id: string;
  calories: number;
  body: Body;
  brain: number;
  dreamGauge: number;
  dreams: number;
  isSleeping: boolean;
  // where the player is, marked in the places menu
  location: Location;
  // only matters on mobile: from tablet up the sidebar is always shown
  isOpen: boolean;
  onClose: () => void;
};

const PLACES_PATH = '/places/';

const LINKS = [
  { to: '/', label: 'Game', Icon: Utensils },
  { to: '/calendar', label: 'Calendar', Icon: CalendarDays },
  { to: '/balance', label: 'Balance', Icon: Wallet },
  { to: '/profile', label: 'Profile', Icon: User },
];

// The gauges and the pages menu: slides in on mobile, always shown from
// tablet up.
export const Sidebar = ({
  id,
  calories,
  body,
  brain,
  dreamGauge,
  dreams,
  isSleeping,
  location,
  isOpen,
  onClose,
}: SidebarProps) => {
  const { pathname } = useLocation();
  const isOnPlace = pathname.startsWith(PLACES_PATH);
  // Opens by itself when a place is shown, and can be toggled by hand.
  const [isPlacesOpen, setIsPlacesOpen] = useState(isOnPlace);
  const [wasOnPlace, setWasOnPlace] = useState(isOnPlace);
  if (isOnPlace !== wasOnPlace) {
    setWasOnPlace(isOnPlace);
    if (isOnPlace) setIsPlacesOpen(true);
  }

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={styles.backdrop}
        data-open={isOpen || undefined}
        onClick={onClose}
        aria-hidden
      />
      <aside id={id} className={styles.panel} data-open={isOpen || undefined}>
        <CaloriesGauge calories={calories} />
        <BodyGauge
          fatPercent={body.fatPercent}
          musclePercent={body.musclePercent}
        />
        <BrainGauge brain={brain} isSleeping={isSleeping} />
        <DreamGauge dreamGauge={dreamGauge} dreams={dreams} />
        <nav aria-label="Pages" className={styles.nav}>
          {LINKS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={styles.link}
              onClick={onClose}
            >
              <Icon aria-hidden size={18} /> {label}
            </NavLink>
          ))}
          <button
            type="button"
            className={styles.group}
            data-active={isOnPlace || undefined}
            aria-expanded={isPlacesOpen}
            aria-controls={`${id}-places`}
            onClick={() => {
              setIsPlacesOpen((isOpened) => !isOpened);
            }}
          >
            <MapPin aria-hidden size={18} /> Places
            <ChevronDown aria-hidden size={16} className={styles.chevron} />
          </button>
          <div
            id={`${id}-places`}
            className={styles.submenu}
            data-open={isPlacesOpen || undefined}
          >
            <ul className={styles.places}>
              {LOCATIONS.map((place) => {
                const { label, Icon } = PLACES[place];
                return (
                  <li key={place}>
                    <NavLink
                      to={`${PLACES_PATH}${place}`}
                      className={styles.sublink}
                      tabIndex={isPlacesOpen ? undefined : -1}
                      onClick={onClose}
                    >
                      <Icon aria-hidden size={16} /> {label}
                      {place === location && (
                        <span className={styles.here} title="You are here">
                          <span className={styles.visuallyHidden}>
                            (you are here)
                          </span>
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};
