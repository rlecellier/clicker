# ADR 0005 — Les actions durent : le temps défile, le lieu ne change pas seul

- **Statut** : accepté
- **Date** : 2026-10-05
- **Amende** : l'ADR 0004 (§1 le temps, §2 le lieu, §3 la paie, §5 les dépenses)

## Contexte

Avec l'ADR 0004, un clic faisait avancer le temps d'un coup : 8 h de sommeil
valaient une seconde, et on ne voyait rien passer. Le joueur était aussi
ramené chez lui à la fin de l'horaire, sans l'avoir demandé, et les repas
étaient gratuits partout.

## Décision

### 1. Une action lance une activité, le temps défile pendant qu'elle dure

`perform` ne fait plus avancer `elapsedHours` : il pose une **activité**
(`GameState.activity` : `id`, `from`, `done`) et paie ce qu'il faut payer tout de
suite (pièces, portions du frigo). L'action `tick` du reducer fait ensuite
passer des heures de jeu, au plus ce qu'il reste à l'activité.

- Un hook `useActionClock` envoie un `tick` à chaque frame (`requestAnimationFrame`)
  tant qu'une activité tourne. Rien ne tourne sans activité.
- La vitesse est fixe : **1 heure de jeu par seconde réelle**
  (`HOURS_PER_SECOND`). Il n'y a pas de vitesse réglable, ni de bouton +/-.
- Un onglet en arrière-plan n'a pas de frame : tout le retard est rejoué au
  retour, sans plafond (ADR 0002 §1).
- Les jauges, le livre, la paie et le calendrier suivent le temps à chaque
  `tick`, pas à la fin. La fin de l'activité apporte ce qui ne se découpe pas :
  l'embauche (recherche d'emploi) et le remplissage du frigo (courses).
- Une seule activité à la fois : tout le reste (autre action, changer de lieu,
  chercher un job) est bloqué (`Busy`) tant qu'elle n'est pas finie.
- Elle n'est pas sauvegardée : `useAutoSave` attend la fin de l'activité. Un
  rechargement en plein milieu reprend la partie avant l'action.

### 2. Le joueur reste où il est

La fin d'un horaire ne ramène plus chez soi. Seul « Go home » / « Go to work »
change le lieu. Le midi au travail, le joueur doit donc trouver à manger sur
place.

### 3. Une action « partout » : Think

`Action.place` accepte `'anywhere'`. **Think** (30 min, 1 h, 2 h) est offerte à la
maison comme au travail et laisse simplement passer le temps (`kind: 'think'`).

### 4. Les repas : frigo à la maison, pièces dehors

- Le joueur commence avec **20 pièces** (`INITIAL_COINS`) et un frigo plein.
- `GameState.fridge`, de 0 à 10 (`FRIDGE_MAX`) : chaque repas à la maison
  (petit-déjeuner, déjeuner, dîner) prend une portion, au démarrage. Frigo vide :
  plus de repas à la maison.
- **Go shopping** (maison, 1 h) remplit le frigo à la fin. Bloqué si le frigo est
  plein.
- **Eat out** (travail, 1 h, 8 pièces) nourrit comme un déjeuner et ne touche pas
  au frigo. Bloqué sans les pièces.
- La paie est calculée en entiers au fil du temps
  (`⌊taux × fait⌋` à chaque `tick`) : une demi-heure de travail donne toujours
  5 pièces, quelle que soit la taille des frames.

### 5. Sauvegarde version 8

Ajout de `fridge`. Les sauvegardes d'une autre version sont ignorées, et une
sauvegarde qui porte une activité est refusée.

## Conséquences

- Le reducer reste pur : le temps réel entre par l'action `tick`, le hasard
  (tirage du livre) par `perform`.
- Les tests e2e figent l'horloge du navigateur (`page.clock`) et la font avancer
  avec `elapse` : une heure de jeu = 1 s d'horloge simulée.
- Le rendu se fait à chaque frame pendant une activité (ADR 0002 §5 : l'horloge
  pourra être séparée dans un second context si cela se mesure comme un
  problème).
- Pas de coût pour les courses pour l'instant : seuls les repas dehors coûtent.
