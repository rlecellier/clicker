import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
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
                'Use an alias (@page, @component, @hook, @context) or import the folder index.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['*.config.{js,ts}', 'scripts/*.mjs'],
    languageOptions: { globals: globals.node },
    rules: { 'unicorn/no-top-level-side-effects': 'off' },
  },
  eslintConfigPrettier,
);
