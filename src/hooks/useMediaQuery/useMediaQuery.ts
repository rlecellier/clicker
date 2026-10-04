import { useCallback, useSyncExternalStore } from 'react';

// Whether a CSS media query matches, kept up to date when it changes.
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = matchMedia(query);
      list.addEventListener('change', onChange);
      return () => {
        list.removeEventListener('change', onChange);
      };
    },
    [query],
  );
  const getSnapshot = () => matchMedia(query).matches;
  return useSyncExternalStore(subscribe, getSnapshot);
};
