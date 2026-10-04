/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const fromSource = (path: string) =>
  fileURLToPath(new URL(`src/${path}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@page': fromSource('pages'),
      '@component': fromSource('components'),
      '@hook': fromSource('hooks'),
      '@context': fromSource('contexts'),
      '@test': fromSource('test'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/testSetup.ts'],
    globals: false,
  },
});
