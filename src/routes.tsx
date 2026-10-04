import type { RouteObject } from 'react-router';

import { ErrorPage } from '@page/ErrorPage';
import { GamePage } from '@page/GamePage';
import { RootLayout } from '@page/RootLayout';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <GamePage /> }],
  },
];
