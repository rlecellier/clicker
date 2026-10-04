# Idée — actions prévues dans le calendrier

- **Statut** : idée brute, en cours de description. Rien n'est développé.
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

## À préciser (questions ouvertes, à venir)

_À compléter par la suite de la description._
