# ADR 0006 — Un calendrier artificiel : une semaine est un mois

- **Statut** : accepté
- **Date** : 2026-10-05
- **Amende** : l'ADR 0004 §1 (les dates affichées) et l'âge du joueur

## Contexte

Une action défile à 1 heure de jeu par seconde réelle (ADR 0005). Avec un
calendrier réel, une année de vie représente plus de 8 700 s de jeu : il ne se
passe presque rien dans le temps d'une partie. Pour que la vie du joueur
avance plus vite, le temps devient artificiel.

## Décision

- **Une semaine du jeu est un mois**, une **année dure 12 semaines** (84 jours,
  2 016 heures). Les jours restent de 24 heures et les semaines de 7 jours,
  du lundi au dimanche.
- Un mois a donc 7 jours, numérotés de 1 à 7 comme les jours de la semaine
  (lundi = 1). La première semaine porte le mois réel du lancement
  (`origin`), les suivantes enchaînent (oct., nov., déc., janv. de l'année
  suivante…). Une semaine ne chevauche jamais deux mois ni deux années :
  `rangeLabel` n'a plus de cas « deux mois ».
- `elapsedHours` reste la seule source de vérité : seules les constantes
  (`WEEKS_PER_YEAR`, `DAYS_PER_YEAR`, `HOURS_PER_YEAR`, dans `@game/time`) et
  les fonctions de `game/time/dates.ts` changent. L'âge (`ageAt`, `lifeTimeAt`)
  compte en années de 12 semaines. La sauvegarde ne change pas (version 8).
- **Ce qui se gagne dans le temps se règle sur ce calendrier** : un mois
  écoulé, c'est une semaine de jeu. Les gains par heure (paie, jauges) ne
  bougent pas ; tout ce qui sera calculé par mois ou par an (salaire mensuel,
  progression de compétences) prendra `HOURS_PER_WEEK` comme mois et
  `HOURS_PER_YEAR` comme année.
- La date de naissance du profil reste une date réelle (`birthDateOf`) : c'est
  l'identité du joueur, pas un jour de ce calendrier.

## Conséquences

- Il passe une année d'âge toutes les 12 semaines de jeu, soit environ 3 h 20
  d'actions en continu.
- Les dates affichées ne correspondent plus à celles de l'horloge du client,
  sauf le jour de la semaine et l'heure au lancement.
