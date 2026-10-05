# ADR 0007 — Trois catégories d'actions : le lieu, le joueur, le téléphone

- **Statut** : accepté
- **Date** : 2026-10-05
- **Amende** : ADR 0005 (`Action.place` n'accepte plus `'anywhere'`)

## Contexte

Une action était liée à un lieu, ou à `'anywhere'` (Think). Ce booléen cachait
deux idées différentes : ce que le joueur fait par lui-même (penser, plus tard
parler, lever la main, faire le clown) et ce qu'il fait avec son téléphone
(plus tard envoyer un SMS, appeler un ami). Les deux s'affichaient mélangées
aux actions du lieu.

## Décision

`Action.category` vaut :

- `place` : l'action du lieu (`place` est alors obligatoire) ;
- `self` : l'action du joueur lui-même, possible partout ;
- `online` : l'action du téléphone, possible partout.

`place` n'existe que pour la catégorie `place`. `isDoableAt(action, location)`
dit si une action se fait où est le joueur ; le reducer et les sélecteurs
passent par lui.

Sur l'accueil et sur la page d'un lieu, `ActionSections` affiche une section par
catégorie, dans l'ordre `place` (titrée « At home », « At work »), `self` (« You »),
`online` (« Phone »). Une catégorie sans action n'est pas affichée : il n'y a
pas encore d'action `online`.

La file « Up next » dit où se fera l'action : `at Home`, `anywhere`,
`on your phone`.

## Conséquences

- Ajouter une action du joueur ou du téléphone ne demande que de déclarer sa
  `category` : elle apparaît dans la bonne section de chaque écran.
- Aucune sauvegarde n'est touchée : l'état ne stocke que l'`ActionId`.
