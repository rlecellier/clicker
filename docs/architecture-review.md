# Revue d'ensemble — lisibilité et architecture

- **Date** : 2026-10-04
- **Périmètre** : tout le dépôt (`src/`, `e2e/`, outillage, CI, ADR).
- **État de santé** : `npm run lint`, `npx tsc --noEmit` et `npm test` (34 tests)
  passent. Le code est propre, petit (~1100 lignes hors CSS) et suit son ADR.
  Cette revue ne cherche pas des bugs : elle regarde ce qui va coincer quand on
  ajoutera des features (nouveaux événements, upgrades, sauvegarde, pause…).

Chaque point a un niveau : 🔴 à décider avant la prochaine feature, 🟠 utile
bientôt, 🟡 petit confort. Les décisions à prendre sont regroupées à la fin.

## Ce qui est bien (à garder)

- Structure ADR 0001 respectée partout : un dossier par unité, `index.ts`,
  alias, `func-style`. Les imports sont lisibles.
- Logique pure isolée et testée (`earnings.ts`), composants bêtes
  (`PendingPay`, `MoneyCounter`, `WorkingDayProgress`).
- Événements du calendrier **en données** (`events.ts`) : bon pari pour la suite.
- Tests à deux niveaux (Vitest + parcours Playwright) avec horloge contrôlée.

## 1. Architecture

### 🔴 1.1 `useGame` est un « god hook » et le seul point d'entrée du jeu

`useGame` compose l'horloge, l'argent, le timer de la journée de travail et les
gains, puis renvoie **14 champs à plat**. `GamePage` les destructure tous et les
redistribue (`TimeControls` reçoit 5 props qui viennent toutes de l'horloge).
Chaque feature ajoutera des champs à ce type unique.

Le state est créé dans `RootLayout` et transmis via `useOutletContext<UseGameResult>()`.
Ça marche, mais :

- le couplage `RootLayout` → `GamePage` est invisible (un cast de type, aucune
  erreur si on rend `GamePage` ailleurs) ;
- l'ADR 0001 §3 décrit déjà `contexts/GameContext/` et l'alias `@context/*` est
  déclaré, mais **aucun context n'existe** : la convention n'est pas appliquée.

**Proposition** : un `GameContext` conforme à l'ADR (`GameProvider` +
`useGameContext`), monté dans `RootLayout` ou `main.tsx`. Les composants
consomment ce dont ils ont besoin (`useGameContext()`), ce qui supprime le
« prop drilling » de `GamePage` et rend les composants testables avec un
provider.

### 🔴 1.2 Pas de modèle de temps unique

Aujourd'hui il y a **deux horloges** :

| Quoi | Temps utilisé |
| ------------------------ | --------------------------------------------------- | --- |
| Calendrier, salaire | temps de jeu (`useWeekClock`, accéléré ×0,25 → ×32) |
| Journée de travail (5 s) | temps réel (`performance.now()` dans `useGame`) |

> **Décision** : on gardera bien **deux horloges** (temps de jeu et temps réel)
> pour certaines actions. Les événements en cours (repas, cake) se déroulent en
> temps de jeu.

Quand on ajoutera des durées (trajets, cooldowns, upgrades temporisés), chaque
feature devra choisir. Le plus simple est une règle : **le temps de jeu est la
seule source de vérité**, tout se calcule à partir de `elapsedHours`.

De plus, `useWeekClock` ne renvoie que `{ week, weekHour }` alors que la donnée
brute est `elapsedHours`. Les consommateurs refont la conversion
(`week * DAYS_PER_WEEK + currentDay` dans `WeekCalendar`, `GAME_START +
week * 7 * MS_PER_DAY` dans `earnings.ts`, `MS_PER_DAY` défini deux fois).

**Proposition** : exposer `elapsedHours` (ou un `gameTime`) et regrouper les
helpers temporels purs (`dateAt(elapsedHours)`, `weekdayOf`, `daysInMonth`) dans
un seul module.

### 🔴 1.3 Pas d'état sérialisable → pas de sauvegarde

Un clicker aura une sauvegarde très vite. Or :

- `GameState` ne contient que `money` ; le temps écoulé, la vitesse et la
  journée en cours ne sont pas dans l'état initial (`useGame(initialState)`
  ignore tout sauf `money`) ;
- la journée de travail stocke un `performance.now()` (non sérialisable, sans
  sens après rechargement) ;
- l'état est éclaté en 4 `useState` + une horloge, avec des règles de
  transition réparties dans des `useEffect`.

**Proposition** : un `GameState` complet (`money`, `elapsedHours`,
`workingDayEndsAt` en heures de jeu…) et un **reducer pur** (`click`,
`startWorkingDay`, `tick(deltaHours)`, `setSpeed`). Le hook devient une fine
couche React (`useReducer` + boucle de tick). La sauvegarde devient
`JSON.stringify(state)`, et la logique se teste sans timers.

### 🟠 1.4 La logique métier vit dans `hooks/`

`earnings.ts`, `EVENTS`, `CalendarEvent`, `GAME_START`, `MONTHLY_SALARY` sont du
TypeScript pur, mais rangés dans des dossiers de hooks. Conséquence : des
dépendances à l'envers.

- `WeekCalendar` (composant) importe `GAME_START` depuis `@hook/useGame`, qui
  est un niveau « au-dessus » (`useGame` dépend de `useWeekClock`) ;
- `useGame/earnings.ts` importe `EVENTS` depuis `@hook/useWeekClock`.

L'ADR le prévoyait (« par exemple pour un dossier `game/` »).

**Proposition** : `src/game/` (alias `@game/*`) pour le domaine pur :
`time/`, `events/`, `earnings/`, `constants`. Les hooks deviennent de minces
adaptateurs React. Règle de dépendance simple : `game` ← `hooks` ← `components`
← `pages`, jamais l'inverse.

### 🟠 1.5 Le modèle d'événements est prêt pour un seul cas

`CalendarEvent.kind` vaut `'work'` (littéral unique). `isWorking` et
`pendingPay` refont la même double boucle `événement × jour`. Pour les
prochains événements (sommeil, week-end, sport, événements ponctuels…) il
manque :

- une notion d'**occurrence** (`eventsAt(weekHour)`, `occurrencesOf(event)`)
  partagée par le calendrier, le salaire et les futurs effets ;
- un champ d'**effet** plutôt qu'un `kind` testé en dur (`'work'` → « paie le
  salaire »), pour qu'un nouvel événement n'oblige pas à modifier
  `earnings.ts` ;
- le support d'un événement qui passe minuit (`end <= 24` implicite) et des
  heures non entières (le `title` affiche `${start}:00`, soit « 8.5:00 »).

### 🟠 1.6 Argent en flottants

`money + salary` additionne des montants arrondis au centime (`roundCents`) et
`MoneyCounter` masque les résidus avec `Number(amount.toFixed(2))`. Dès qu'il y
aura plusieurs sources de revenus, des pourcentages ou des upgrades
multiplicatifs, des erreurs de flottants apparaîtront.

**Proposition** : stocker l'argent en **centimes entiers** dans l'état, ne
formater qu'à l'affichage (un helper `formatMoney`).

### 🟠 1.7 Le temps de jeu saute quand l'onglet est en arrière-plan

`useWeekClock` ajoute `(now - last)` sans plafond. `requestAnimationFrame`
s'arrête quand l'onglet est caché ; au retour, le premier tick injecte tout le
temps écoulé. À ×8, une minute en arrière-plan = 480 h de jeu ≈ 3 semaines de
salaire d'un coup. C'est peut-être voulu (progression hors-ligne), mais ce doit
être une décision explicite : soit plafonner le delta (et mettre en pause),
soit assumer et le tester.

### 🟡 1.8 Re-render de tout l'arbre à 60 Hz

`setElapsedHours` est appelé à chaque frame : `RootLayout`, `GamePage` et tous
les composants se re-rendent 60 fois par seconde, y compris ceux qui ne
changent jamais (`MoneyCounter`, boutons), et `pendingPay` est recalculé à
chaque rendu. Sans souci à cette taille, mais le coût grandira avec les
features. Pistes, par ordre d'effort : ne publier que les changements visibles
(minute de jeu), séparer l'horloge du reste dans deux contexts, ou passer à un
store externe (`useSyncExternalStore`). À traiter si on mesure un problème, mais
le choix du point 1.1 (un ou plusieurs contexts) le conditionne.

## 2. Lisibilité

### 🟠 2.1 Trois sens du mot « work »

> **Décision** : les actions de démo « Work » (clic) et « Journée de travail »
> (5 s) sont supprimées, on passe à de vraies actions (calories, ci-dessous).
> Il ne reste que le sens « plage horaire du calendrier ».

| Nom | Sens |
| ---------------------------------------- | ---------------------------------- | --- |
| `work()` / bouton « Work » | un clic qui rapporte 1 $ |
| `startWorkingDay` / `isWorkingDay` | le bouton de 5 s qui rapporte 10 $ |
| `kind: 'work'`, `isWorking`, `isEarning` | les plages horaires du calendrier |

Le gameplay « clic » et le gameplay « calendrier » se recouvrent par le
vocabulaire. Quelques renommages suffiraient (`work` → `click`, `isWorking` →
`isWorkHours`), mais il faut d'abord décider si la « journée de travail » de 5 s
survit à l'arrivée du vrai calendrier (voir décisions).

### 🟠 2.2 `WeekCalendar` fait trop de choses

105 lignes qui mélangent calcul de dates, libellés, fenêtre glissante et rendu
d'une colonne. À extraire :

- une colonne `CalendarDay/` en sous-composant (ADR §2 : dossier imbriqué) ;
- le calcul de fenêtre (`firstDay`, `columns`, libellé du mois) dans un helper
  pur testable ;
- `DAY_LABELS` / `MONTH_LABELS` remplacés par `Intl.DateTimeFormat('en',
{ weekday: 'short', timeZone: 'UTC' })`, ce qui évite aussi de maintenir deux
  tableaux (et prépare la traduction).

Le test « 14 événements » repose sur les colonnes hors-champ
(`COLUMNS_BEFORE/AFTER`) : il casserait en changeant une constante visuelle.

### 🟡 2.3 Valeurs dupliquées entre constantes et texte

`GamePage` écrit en dur `Working day (5s, +$…)` alors que
`WORKING_DAY_DURATION_MS` existe : changer la constante désynchronise le bouton.
Même chose dans les tests e2e (`1000 / 8` au lieu de `DEFAULT_SPEED`, alors que
les tests unitaires, eux, l'importent).

### 🟡 2.4 `TimeControls` est un outil de debug exposé en production

Déjà noté dans la PR #8 comme suivi. À conditionner (`import.meta.env.DEV` ou
flag) avant que le jeu ait de vrais joueurs.

### 🟡 2.5 Détails de nommage et de structure

- `useWeekClock/index.ts` et `useGame/index.ts` exportent des constantes et des
  données (`EVENTS`, `GAME_START`) : l'API publique d'un « hook » n'est plus un
  hook (se règle avec 1.4).
- `useGame` renvoie `money: money + salary` : le champ `money` n'est pas l'état
  `money`. Un nom comme `balance` ou le calcul fait dans le reducer (1.3)
  clarifierait.

## 3. Outillage, CI et documentation

### 🔴 3.1 Aucune CI sur les pull requests

Les workflows sont `deploy.yml` (push sur `main` uniquement) et `demo.yml`
(commentaire `/demo`). Lint, tests et build ne tournent **qu'après le merge**.
Un MR rouge peut être mergé, et la PR #10 indique que `npm run e2e` n'a pas pu
être exécuté. Ni `tsc` seul, ni `format:check`, ni les parcours e2e ne sont dans
la CI.

**Proposition** : un `ci.yml` sur `pull_request` : `npm ci`, `lint`,
`tsc --noEmit`, `format:check`, `test`, `build`, puis `e2e` (Chromium Playwright
installé en CI).

### 🟠 3.2 ADR 0001 : incohérences et trous

- §4 parle de `src/styles.css`, la section « Exceptions » et le code de
  `src/global.css`.
- Alias `@test/*` déclaré (tsconfig + vite) mais absent de la table §6.
- Aucune règle pour le code non-React (`game/`), pour les tests e2e, ni pour la
  sauvegarde : à couvrir par un ADR 0002 (cf. décisions).
- Les alias sont déclarés à deux endroits « à garder synchronisés »
  (`tsconfig.json` + `vite.config.ts`). Vite récent sait lire les `paths` du
  tsconfig (`resolve.tsconfigPaths`) : une source de vérité au lieu de deux. À
  vérifier sur la version installée avant de l'adopter.

### 🟡 3.3 README

Il liste `dev`, `build`, `test`, `lint`, `format` mais pas `e2e`, `format:check`
ni un lien vers les ADR. Un paragraphe « architecture » (3 lignes + lien) aide
quiconque arrive sur le projet.

### 🟡 3.4 Styles

Les couleurs sont écrites en dur dans 21 endroits des CSS modules (`#3b82f6`,
`#1b1d23`…) et `global.css` style tous les `button` globalement. Des variables
CSS (`--color-accent`, `--color-bg`) dans `global.css` évitent les divergences
quand l'interface grossira (upgrades, panneaux).

## 4. Décisions à prendre

| #   | Décision                                       | Recommandation                                                                                                                                                                | Décision                                                                                                                                           |
| --- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Où vit l'état du jeu ?                         | `GameContext` selon l'ADR §3 (1.1), à la place de `useOutletContext`.                                                                                                         | ✅ Accepté.                                                                                                                                        |
| D2  | Modèle d'état                                  | Un `GameState` complet sérialisable + reducer pur (1.3), avec le temps de jeu comme seule horloge (1.2). Fait d'un seul bloc, c'est aussi ce qui rend la sauvegarde triviale. | ✅ Accepté.                                                                                                                                        |
| D3  | Où range-t-on la logique pure ?                | `src/game/` avec alias `@game/*` (1.4), documenté dans un ADR 0002.                                                                                                           | ✅ Accepté.                                                                                                                                        |
| D4  | Que devient la « journée de travail » de 5 s ? | À trancher côté produit : supprimée (le calendrier la remplace), ou convertie en événement/action en temps de jeu. Conditionne le vocabulaire (2.1).                          | ✅ Supprimée : les actions de démo « Work » et « Journée de travail » sont retirées, remplacées par les actions calories (fait).                   |
| D5  | Onglet en arrière-plan                         | Plafonner le delta (et pause) ou progression hors-ligne assumée (1.7).                                                                                                        | ✅ Le jeu continue de progresser quand l'onglet est en arrière-plan : pas de plafond de delta (déjà le cas, le delta est rejoué par pas de 3 min). |
| D6  | Argent                                         | Centimes entiers (1.6), à faire en même temps que D2.                                                                                                                         | ✅ Accepté.                                                                                                                                        |
| D7  | CI                                             | Ajouter `ci.yml` sur les PR (3.1), indépendant des autres, à faire en premier.                                                                                                | ✅ Accepté.                                                                                                                                        |

## 5. Ordre proposé

Une MR par ligne, chacune petite et mergeable seule :

1. 👷 **CI sur les PR** (D7) — filet de sécurité pour tout le reste.
2. 📝 **ADR 0002** (D1, D2, D3, D6) : acte les choix ci-dessus avant de coder.
3. ♻️ **`src/game/`** : déplacer le domaine pur, sans changement de
   comportement (1.4).
4. ♻️ **Reducer + `GameState` complet + `GameContext`** (1.1, 1.2, 1.3, 1.6).
5. ✨ **Sauvegarde locale**, puis traitement du plafond de delta (1.7).
6. ♻️ **Lisibilité** : `WeekCalendar` découpé, `Intl`, renommages, variables CSS
   (2.x, 3.4) — indépendant, peut passer à tout moment.

## 6. Mécanique des calories (décidée en revue)

Premier vrai gameplay, qui remplace les actions de démo :

- Jauge de **calories** en %, à maintenir entre **20 % et 80 %**.
- Elles **baissent** au fil de la journée (2 %/h), **plus vite pendant le travail**
  (4 %/h).
- Événements **Breakfast** (7h–7h30, +15 %), **Lunch** (12h–13h, +25 %) et
  **Dinner** (19h–20h, +25 %) tous les jours : ils ajoutent leurs calories
  pendant qu'ils se déroulent.
- Action **Eat a snack** : +10 % en une fois.
- Action **Enjoy a cake** : 30 minutes de temps de jeu, +20 % réparties sur sa
  durée, possible pendant le travail.
- Tout excédent au-delà de **80 %** devient du **gras**. La conversion réduit
  les calories, et elle est d'autant plus rapide que l'excédent est grand
  (≈ 1,5 × l'excédent par heure de jeu). Au-delà de 100 %, le surplus devient
  du gras immédiatement.
