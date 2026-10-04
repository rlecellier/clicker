# Clicker

A small clicker app built with React, TypeScript and Vite.

[Essayer le POC](https://rlecellier.github.io/clicker/)

## Getting started

```sh
npm install
npm run dev
```

## Scripts

| Command                | Description                   |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Start the Vite dev server     |
| `npm run build`        | Type-check and build for prod |
| `npm run preview`      | Preview the production build  |
| `npm test`             | Run the tests once (Vitest)   |
| `npm run test:watch`   | Run the tests in watch mode   |
| `npm run lint`         | Lint with ESLint              |
| `npm run format`       | Format with Prettier          |
| `npm run format:check` | Check the formatting          |
| `npm run e2e`          | Run the Playwright journeys   |

## Architecture

The pure game rules (time, calendar, salary, calories, state and reducer) live
in `src/game/` and know nothing about React; hooks, contexts and components
adapt them to the screen. The conventions are written down in the ADRs of
[`.claude/adr/`](.claude/adr/) (project structure, game architecture) and a
review of the project is in [`docs/architecture-review.md`](docs/architecture-review.md).

The e2e journeys (`e2e/`) are real tests; on every pull request the
`MR demo` workflow replays them and posts the screenshots listed in
`e2e/demo.json`.

## Deployment

Every push to `main` that changes the site runs lint, tests and build, then
deploys to GitHub Pages via `.github/workflows/deploy.yml`. The base path is set
with the `BASE_PATH` environment variable (`/clicker/` on Pages).

## License

See [LICENSE](LICENSE).
