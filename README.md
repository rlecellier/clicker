# Clicker

A small clicker app built with React, TypeScript and Vite.

**Live demo:** https://rlecellier.github.io/clicker/

## Getting started

```sh
npm install
npm run dev
```

## Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start the Vite dev server     |
| `npm run build`      | Type-check and build for prod |
| `npm run preview`    | Preview the production build  |
| `npm test`           | Run the tests once (Vitest)   |
| `npm run test:watch` | Run the tests in watch mode   |
| `npm run lint`       | Lint with ESLint              |
| `npm run format`     | Format with Prettier          |

## Deployment

Every push to `main` that changes the site runs lint, tests and build, then
deploys to GitHub Pages via `.github/workflows/deploy.yml`. The base path is set
with the `BASE_PATH` environment variable (`/clicker/` on Pages).

## License

See [LICENSE](LICENSE).
