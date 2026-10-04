import { data, type RouteObject } from 'react-router';

import { CalendarPage } from '@page/CalendarPage';
import { ErrorPage } from '@page/ErrorPage';
import { BalancePage } from '@page/BalancePage';
import { GamePage } from '@page/GamePage';
import { PlacePage } from '@page/PlacePage';
import { ProfilePage } from '@page/ProfilePage';
import { RootLayout } from '@page/RootLayout';
import { isLocation } from '@game/location';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <GamePage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'balance', element: <BalancePage /> },
      { path: 'profile', element: <ProfilePage /> },
      {
        path: 'places/:place',
        element: <PlacePage />,
        loader: ({ params }) => {
          if (!isLocation(params.place)) {
            throw data(undefined, { status: 404, statusText: 'Not Found' });
          }
        },
      },
    ],
  },
];
