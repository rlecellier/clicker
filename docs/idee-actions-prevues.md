# Idée — actions prévues dans le calendrier

- **Statut** : écartée pour la première boucle de jeu (voir l'ADR 0004).
- **Date** : 2026-10-04
- **Note** : l'idée est peut-être à « reverse » plus tard (à tester d'abord).

## Idée

Dans l'onglet calendrier, on distingue deux familles d'actions :

1. **Les actions qu'on est censé faire** : ce qu'on a aujourd'hui (dormir,
   travailler, manger).
2. **Les actions qu'on a prévu de faire** : des activités planifiées en plus,
   pas imposées par le rythme de base.

## Premier exemple

- **Lire un livre**, quand on est à la maison.

## Mode de déclenchement : `auto` ou `ask`

Chaque action prévue est taguée avec un mode :

- **`auto`** : l'action se déroule automatiquement, sans intervention.
- **`ask`** : on demande au joueur « voulez-vous faire cette action ? » avant de
  la lancer. Sur desktop, une pop-up ; sur mobile, une page entière.

## Création d'une action : récurrence

À la création, en plus du mode `auto` / `ask`, on choisit si l'action est
**récurrente** et, si oui, **à quelle récurrence**. Le modèle de référence est
Google Calendar.

## Unification avec les événements existants

« Action » et « événement » désignent la même chose. Les événements existants
(`eat`, `sleep`, `work`) doivent suivre le **même pattern** que les actions
prévues : un mode `auto` / `ask` et une récurrence. Il n'y a donc qu'un seul
modèle pour les deux familles.

## Début de partie : le bouton « Get a Job »

Au début de la partie, le joueur n'a pas de travail. Un bouton **Get a Job**
ouvre, comme pour un événement `ask` (modale sur desktop, page entière sur
mobile), la liste des jobs disponibles.

- Aujourd'hui, un seul job : **vendeur de vêtements**.
- Cliquer dessus : le joueur devient vendeur de vêtements.

### Impact sur le calendrier

Deux effets, sur les **horaires de travail déjà définis** :

1. **Ce qu'il doit faire** : vendre des vêtements.
2. **Ce qu'il a prévu de faire** : « aller au travail pour vendre des
   vêtements », ajouté automatiquement sur les mêmes horaires.

Plus tard, le joueur pourra reconfigurer son prévu pour que ce qu'il fait
effectivement diffère de ce qu'il doit faire.

### `eat` et `sleep`

Ils deviennent des événements **que le joueur a choisi de faire** (donc du
côté « prévu »), présents **par défaut**.

## À préciser (questions ouvertes, à venir)

_À compléter par la suite de la description._

## Première tranche livrée

- **Statut** : première tranche développée, à tester (voir ADR 0003).
- Fait : modèle unique d'événement (`mode` `auto` / `ask`, récurrence), « Get a
  Job » avec le vendeur de vêtements, obligations et prévu dans le calendrier,
  `eat` / `sleep` par défaut dans le prévu, ajout d'un événement « Lire un livre »
  (heure, récurrence, mode), pop-up / page entière pour `ask`.
- Pas encore fait :
  - modifier ou supprimer un événement du prévu (y compris eat / sleep / work) ;
  - un prévu qui diffère de l'obligation (le salaire suit l'obligation, pas la
    présence réelle) ;
  - récurrence à la Google Calendar complète (jours au choix, fin de série) ;
  - d'autres activités que la lecture, d'autres jobs, démission.
