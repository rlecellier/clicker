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

## Séparation visuel / logique

- **Composants visuels** : ils affichent des props, sans état métier ni effet
  de bord, et sont réutilisables au maximum.
- **Hooks** : toute la logique (état, effets, calculs, appels au context) y est
  encapsulée.
- **Composants orchestrateurs** : au besoin, ils branchent un ou plusieurs
  hooks sur des composants visuels et ne font rien d'autre.

## Politique de test

- **Composant uniquement visuel : pas de test.** S'il n'a ni comportement ni
  logique (il affiche des props), on n'écrit ni test unitaire ni test de rendu.
- **Toute action utilisateur fait partie d'au moins un parcours Playwright**
  (`e2e/*.e2e.ts`). Une nouvelle action sans parcours qui la couvre est
  incomplète : on ajoute l'action au parcours existant ou on en crée un.

Rien d'autre n'est imposé. En particulier, pas de test « par principe » : on
n'écrit pas de test unitaire pour satisfaire une règle de couverture.
