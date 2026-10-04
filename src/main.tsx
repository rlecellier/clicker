import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { routes } from './routes';
import './global.css';

const root = document.querySelector('#root');
if (!root) throw new Error('Root element not found');

const router = createBrowserRouter(routes);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
