import type { RouteObject } from 'react-router';

import { ErrorPage } from '@page/ErrorPage';
import { RootLayout } from '@page/RootLayout';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
  },
];
