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
- **Les règles du jeu se testent en unitaire** (Vitest, sans navigateur) :
  durées, calories, paie, fusion des entrées du calendrier, sauvegarde, etc.
  vivent dans `src/game/` et les hooks, jamais dans un parcours e2e.
- **Peu de parcours Playwright, longs** (`e2e/*.e2e.ts`) : un parcours raconte
  une session de joueur (une journée à la maison, une matinée de travail, la
  navigation et la sauvegarde, le calendrier) et enchaîne les actions dans un
  même test. Un parcours démarre une seule fois la partie ; on n'écrit pas un
  test par règle ou par bouton.
- **Toute action utilisateur fait partie d'au moins un parcours.** Une nouvelle
  action est ajoutée à un parcours existant ; on ne crée un parcours que pour un
  nouveau pan de l'application (et on garde la suite sous une dizaine).
- Dans un parcours, on vérifie qu'une action produit son effet visible, pas
  chaque valeur : le détail chiffré est du ressort des tests unitaires.

Rien d'autre n'est imposé. En particulier, pas de test « par principe » : on
n'écrit pas de test unitaire pour satisfaire une règle de couverture.
