# ADR 0003 — Obligations, événements prévus et déclenchement `ask`

- **Statut** : accepté (à tester : le modèle peut être reversé)
- **Date** : 2026-10-04
- **Contexte de la décision** : `docs/idee-actions-prevues.md`

## Contexte

Le calendrier était une liste fixe d'événements (`EVENTS`) : dormir, manger,
travailler. Le joueur ne pouvait rien y changer, travailler était gratuit et la
lecture était un bouton actif dans les « temps libres ».

## Décision

### 1. Deux familles : ce qu'on doit faire, ce qu'on a prévu

- **Obligations** : ce qu'impose le job du joueur (`JOBS[id].obligations`). Pas
  de job, pas d'obligation. Le salaire suit les obligations, à partir du moment
  de l'embauche (`obligationHoursBetween`).
- **Prévu** (`GameState.plan`) : ce que le joueur a choisi de faire. C'est lui
  qui pilote ce qui se passe réellement : sommeil, repas, travail, lecture.
  `sleep` et `eat` y sont par défaut (`DEFAULT_PLAN`) ; prendre un job y ajoute
  « Go to work » sur les mêmes horaires que l'obligation.

### 2. Un seul modèle d'événement

`CalendarEvent` porte un `mode` (`auto` | `ask`) et une `recurrence`
(`weekly` sur des jours de la semaine, ou `once` un jour de jeu). Les
événements existants suivent le même modèle que les nouveaux.

### 3. Le calendrier se lit en heures de jeu

`eventAt`, `nextEventAfter`, etc. prennent un `Schedule` (`plan` + `declined`) et
une heure de jeu absolue (`elapsedHours`), plus une heure de la semaine : un
événement `once` n'existe pas dans une semaine qui se répète.

### 4. `ask` met le jeu en pause

Quand une occurrence `ask` commence, le reducer s'arrête à son heure de début et
renseigne `asking`. Tant que le joueur n'a pas répondu, `elapse` ne change rien.
`answerAsk` accepte (l'événement se déroule) ou refuse (l'occurrence est ajoutée
à `declined`, purgé des jours passés). L'interface est une modale sur desktop,
une page entière sur mobile (`ModalSheet`).

### 5. La lecture tire ses livres au fil des événements

Un événement « Read a book » fait avancer le livre en cours de la bibliothèque.
S'il n'y en a pas, le premier événement de lecture en tire un parmi les livres
non lus. Le hasard reste hors des règles : l'action `elapse` porte un `roll`
dans [0, 1), fourni par le provider.

### 6. Contraintes

- Les événements commencent et finissent à l'heure ou la demi-heure (les calculs
  découpent le temps par demi-heures).
- Un événement ajouté ne peut pas chevaucher le prévu (`fitsInPlan`).
- La sauvegarde passe en version 6 et valide le prévu (`isCalendarEvent`).

## Conséquences

- Une nouvelle activité = un `kind` et ses effets, plus une entrée dans
  `ACTIVITIES`.
- Le solde passé (page Balance) relit les repas du prévu actuel : si le prévu
  change, l'historique des dépenses recalculé change aussi. À corriger quand le
  prévu deviendra modifiable.
