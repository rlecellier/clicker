# Clicker

Conventions du projet : voir `.claude/adr/0001-project-structure.md`.

## Règles de code

- **Pas de `function` déclarée.** Composants, hooks et helpers s'écrivent
  `const Nom = () => {}` (fonction fléchée assignée à un `const`), jamais
  `function Nom() {}`. Cette règle prime sur les exemples en `function` des
  skills (`react-dev`, etc.). Elle est appliquée par ESLint (`func-style`).

## Merge des MR

- **Toujours en « rebase and merge »** : le dépôt refuse les merge commits et
  on garde les commits unitaires (skill `commit`), donc pas de squash.
- Pour que le rebase merge passe, la branche doit être linéaire : quand `main`
  avance, on rebase la branche dessus (`git rebase origin/main`, puis
  `git push --force-with-lease`), on ne merge pas `main` dedans.
- On ne merge qu'une fois la CI verte sur le dernier commit.
