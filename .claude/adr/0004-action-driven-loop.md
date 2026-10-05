# ADR 0004 — Première boucle de jeu : le temps avance par les actions

- **Statut** : accepté (à tester : le modèle peut être reversé) ; §1, §2, §3 et §5
  amendés par l'ADR 0005 (le temps défile pendant l'action, le lieu ne change
  pas seul, repas payants et frigo)
- **Date** : 2026-10-05
- **Remplace** : l'horloge temps réel (ADR 0002 §1), le calendrier « prévu »
  et le déclenchement `ask` (ADR 0003)

## Contexte

Le jeu tournait seul : une horloge `requestAnimationFrame` faisait avancer le
temps, un calendrier de rythme (dormir, manger, travailler) décidait de ce que
le joueur faisait, et le joueur ne pouvait qu'ajouter des événements. Il n'y
avait pas de vraie boucle : pas de choix à faire, pas de conséquence d'un clic.

## Décision

### 1. Le temps ne bouge que par une action

Plus d'horloge, de vitesse ni de `useFrameLoop`. `elapsedHours` (ADR 0002 §1)
reste la seule source de vérité du temps, mais il n'est modifié que par le
reducer, quand le joueur agit. Tout est sérialisé à chaque action
(`useAutoSave`).

La partie commence à la **date et à l'heure du client** (`gameStartOf`) : le
`origin` de l'état est le lundi de cette semaine (jour 0 du jeu), `startHours`
l'heure de lancement arrondie à la demi-heure. Les dates affichées se calculent
depuis `origin`, plus depuis une constante.

### 2. Les actions dépendent du lieu

`GameState.location` (`home` | `work`) décide des actions offertes
(`actionsAt`) :

- **Appartement** (sans loyer) : chercher un job, manger (petit-déj 30 min,
  déj 1 h, dîner 1 h), lire (1 h), dormir 2, 4, 6 ou 8 h, aller au travail si
  on a un job.
- **Travail** : travailler (un clic = 30 min de jeu), rentrer à la maison.

Aller au travail ou rentrer ne prend pas de temps. On ne peut travailler que
pendant un horaire (`shiftAt`). À la fin de l'horaire, le joueur rentre seul.
Chercher un job prend une heure et embauche le joueur.

### 3. La paie se fait au clic, en pièces d'or

Chaque demi-heure travaillée paie `hourlyCoins × heures` pièces d'or (entiers).
Plus de salaire hebdomadaire ni de loyer ; les repas sont gratuits pour
l'instant. `balanceCents` devient `coins` ; l'icône est `Coins` de lucide.

### 4. Le calendrier raconte ce qui a été fait

Il démarre vide. Un job y ajoute ses horaires (`Job.shifts`), en colonne fine
(« Must »). Chaque action faite s'écrit dans `GameState.history`, en colonne
principale. Deux actions de même nature faites à la suite se fusionnent en
une seule entrée (`recordDone`) : travailler ou dormir plusieurs fois de suite
donne un seul bloc.

### 5. Ce qui a été retiré

Le prévu (`plan`, `declined`), `asking` et ses écrans, l'ajout d'événements,
les vitesses, le snack, le gâteau, le restaurant et les dépenses. Les règles de
nutrition, de sommeil et de lecture ne lisent plus un calendrier : elles
reçoivent l'action qui vient d'être faite.

La sauvegarde passe en version 7 : les anciennes parties sont ignorées.

## Conséquences

- Le jeu est un tour par tour : plus rien ne se passe hors des clics.
- Le reducer reste pur ; le hasard (tirage du livre) arrive par l'action.
- Il n'y a plus de dépense : la page Balance ne montre que la paie. Les
  dépenses reviendront avec leurs actions.
- Un événement qui chevauche minuit est coupé à l'affichage, pas dans l'état.
