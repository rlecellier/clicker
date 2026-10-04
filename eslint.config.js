import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'test-results', 'playwright-report'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    languageOptions: { globals: globals.browser },
  },
  {
    rules: {
      // Components, hooks and helpers are `const x = () => {}` (ADR 0001, §7)
      'func-style': ['error', 'expression'],
      // React naming: MyComponent/, useMyHook/ (see .claude/adr/0001)
      'unicorn/filename-case': [
        'error',
        { cases: { pascalCase: true, camelCase: true } },
      ],
      // `Props` / `props` are React standard names
      'unicorn/name-replacements': [
        'error',
        { replacements: { props: false, prop: false, ref: false } },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', './*/*'],
              message:
                'Use an alias (@page, @component, @hook, @game, @context) or import the folder index.',
            },
          ],
        },
      ],
    },
  },
  {
    // The game rules are pure TypeScript: no React, and nothing from the UI
    // layers (ADR 0002, §4).
    files: ['src/game/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', './*/*'],
              message: 'Use an alias (@game) or import the folder index.',
            },
            {
              group: ['react', 'react-*', '@base-ui/*', 'lucide-react'],
              message: 'src/game is pure logic: no React or UI library.',
            },
            {
              group: ['@page/*', '@component/*', '@hook/*', '@context/*'],
              message: 'src/game never depends on the UI layers.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
    rules: { 'unicorn/no-top-level-side-effects': 'off' },
  },
  eslintConfigPrettier,
);
