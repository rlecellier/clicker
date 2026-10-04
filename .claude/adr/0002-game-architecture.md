# ADR 0002 — Architecture du jeu : état, temps et logique pure

- **Statut** : accepté
- **Date** : 2026-10-04
- **Contexte de la décision** : revue d'architecture (`docs/architecture-review.md`),
  décisions D1, D2, D3 et D6 acceptées en revue.

## Contexte

`useGame` est devenu le point d'entrée de tout le jeu : il porte l'état, l'horloge
et les règles, et il est passé aux pages par `useOutletContext`. Le calendrier et
le salaire utilisent le temps de jeu, la journée de travail utilisait le temps
réel, l'état n'est pas sérialisable et l'argent est un flottant. Ces choix
bloquent la sauvegarde et rendent chaque nouvelle mécanique (calories, upgrades)
plus coûteuse que la précédente.

## Décision

### 1. Le temps de jeu est la seule source de vérité (D2)

Tout ce qui dépend du temps se calcule à partir de **`elapsedHours`**, le nombre
d'heures de jeu écoulées depuis le début. Les durées, les événements et les
effets progressifs (calories, salaire) se rangent dans ce temps-là.

- Pas de `performance.now()` ni de `Date.now()` dans l'état ou dans les règles.
- Une action ponctuelle (un cake) enregistre l'heure de jeu où elle commence,
  pas un instant réel.
- L'horloge ne fait que produire le temps de jeu à partir du temps réel (vitesse,
  onglet en arrière-plan : tout le delta est rejoué, jamais plafonné).

Une exception reste possible pour une animation purement visuelle, qui n'entre
jamais dans l'état du jeu.

### 2. Un `GameState` complet, sérialisable, et un reducer pur (D2)

L'état du jeu est **un objet JSON** qui contient tout ce qu'il faut pour
reprendre la partie : temps écoulé, vitesse, argent, calories, gras, action en
cours. Il ne contient ni fonction, ni `Date`, ni instant du navigateur.

Les changements d'état passent par un **reducer pur** `(state, action) => state`
(`tick`, `eatSnack`, `enjoyCake`, `setSpeed`, …). Le reducer ne lit ni l'heure
ni un `Math.random()` : tout ce dont il a besoin est dans l'état ou dans
l'action. La sauvegarde est alors une simple sérialisation de `GameState`.

### 3. L'argent est en centimes entiers (D6)

L'argent est stocké en **centimes**, en nombre entier. La conversion en dollars
ne se fait qu'à l'affichage (`Intl.NumberFormat`). Le salaire hebdomadaire est
arrondi au centime au moment du calcul, une seule fois.

### 4. La logique pure vit dans `src/game/` (D3)

Les règles du jeu (salaire, calories, calendrier, reducer) sont des **fonctions
pures sans React**, rangées dans `src/game/`, avec l'alias `@game/*`.

- Un dossier par unité, comme pour les composants (ADR 0001 §1 et §5) : un
  `index.ts` qui expose l'API publique, les tests à côté.
- `src/game/` n'importe jamais `react`, ni `@hook/*`, ni `@component/*`, ni
  `@page/*`. Les dépendances vont dans un seul sens : composants et hooks
  dépendent de `game/`, jamais l'inverse.
- Les constantes et les données (`EVENTS`, `GAME_START`) vivent dans `game/`,
  pas dans l'`index.ts` d'un hook : un hook n'exporte que des hooks.
- Les hooks restent la couche d'adaptation vers React (horloge `rAF`, context).

L'alias `@game/*` s'ajoute à la table de l'ADR 0001 §6, dans `tsconfig.json` et
`vite.config.ts`. L'alias `@test/*` (déjà déclaré) y est ajouté en même temps.

### 5. L'état du jeu vit dans un `GameContext` (D1)

L'état est porté par un `GameContext` selon l'ADR 0001 §3 : `GameContext.ts`,
`GameProvider.tsx` et `useGameContext.ts`. Le provider est monté dans
`RootLayout` ; il remplace `useOutletContext`. Les composants appellent
`useGameContext()` et ne reçoivent plus les champs en cascade depuis `GamePage`.

Le provider tient le reducer et l'horloge. Si les rendus à chaque frame
deviennent un problème mesuré, l'horloge sera séparée dans un second context ;
ce n'est pas décidé ici.

### 6. Tests

- Politique : voir `CLAUDE.md` (« Politique de test »). Pas de test pour un
  composant uniquement visuel ; toute action utilisateur est couverte par au
  moins un parcours Playwright.
- La logique de `game/` se teste sans React, avec des tests unitaires simples.
- Les parcours e2e (`e2e/*.e2e.ts`) restent de vrais tests ; ils servent aussi de
  démo de MR (skill `merge-request`).
- Un état de départ de test se construit avec les factories de `@test/*`.

## Conséquences

- Sauvegarder, recharger et rejouer une partie deviennent triviaux.
- Une nouvelle mécanique est un cas de reducer et des fonctions pures testées,
  pas un nouvel état ni une nouvelle horloge dans `useGame`.
- Un peu plus de structure (`game/`, un context) pour un projet encore petit :
  c'est le prix de la sauvegarde.
- Le travail se fait en plusieurs MR dans l'ordre de la revue : `src/game/`,
  puis reducer et context, puis sauvegarde.

## Application dans l'outillage

À faire dans les MR qui suivent, pas dans celle-ci :

- Alias `@game/*` et `@test/*` dans `tsconfig.json` et `vite.config.ts`.
- Règle ESLint `no-restricted-imports` pour interdire `react` et les alias
  `@hook/*`, `@component/*`, `@page/*` depuis `src/game/`.
