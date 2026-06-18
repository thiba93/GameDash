# Protocole d'exécution des phases

## Objectif

Définir comment le workflow du dépôt doit interpréter les invites telles que `/phase1`, `/phase 3` ou `/phase 7`.

Il s'agit d'une convention d'invite pour les sessions qui chargent ce dépôt. Ce n'est pas une commande shell native.

## Source de vérité

- La portée, l'ordre et les résultats attendus des phases sont définis dans `docs/03-roadmap-gamedash.md`.
- Les portes de validation sont définies dans `docs/phase-gates.md`.
- Les règles de fonctionnement locales au dépôt sont définies dans `AGENTS.md`.

En cas de désaccord entre deux documents, `docs/03-roadmap-gamedash.md` l'emporte pour la portée et l'ordre, puis `docs/phase-gates.md` l'emporte pour les critères de réussite/échec, puis `AGENTS.md` l'emporte pour le comportement opérationnel.

## Formes d'invites acceptées

- `/phase0`
- `/phase 0`
- `/phase1`
- `/phase 1`
- `/phase8`
- `/phase 8`
- `/phase9`
- `/phase 9`

Toute invite de ce type signifie : exécuter la phase de la feuille de route demandée de bout en bout selon ce protocole.

## Flux d'exécution obligatoire

1. Extraire le numéro de phase cible de l'invite.
2. Lire `AGENTS.md`, `docs/03-roadmap-gamedash.md`, `docs/phase-gates.md`, `docs/mvp-scope.md`, `docs/backlog-mvp.md`, `docs/security-baseline.md` et `docs/decision-log.md`.
3. Synchroniser la branche avec `main` via `git pull --rebase`.
4. En cas de conflits de rebase, les résoudre directement, puis continuer.
5. Évaluer chaque porte de phase prérequise de `0` jusqu'à `cible - 1`.
6. Si une phase prérequise échoue, s'arrêter immédiatement et retourner un rapport de blocage simple. Ne pas implémenter la phase demandée et ne pas continuer vers les phases ultérieures.
7. Si toutes les phases prérequises passent, implémenter la phase cible avec une portée verticale complète :
   API + schéma + contrats partagés + UI + tests + docs.
8. Mettre à jour chaque artefact affecté dans la même phase si nécessaire :
   code, docs, tests, `contracts/openapi.yaml`, `prisma/schema.prisma`, migrations, données de seed ou de fixtures locales.
9. Exécuter la suite de validation obligatoire.
10. Si une validation échoue, corriger le problème, relancer la validation en échec, puis relancer la suite complète jusqu'à ce que tout passe ou qu'un bloqueur dur soit atteint.
11. Utiliser autant de commits que nécessaire pendant l'exécution, mais les garder révisables et utiliser les Conventional Commits.
12. Pousser le résultat vers `main`.
13. Si le push est rejeté parce que le remote a avancé, relancer `git pull --rebase`, relancer la suite de validation complète, puis réessayer le push.
14. Terminer avec le rapport de phase standard.

## Règle de blocage

Pour une phase demandée `N`, chaque phase antérieure doit déjà passer sa porte sur la branche courante avant que l'implémentation ne commence.

Exemple :
- `/phase3` doit bloquer si la phase 0, la phase 1 ou la phase 2 échoue.
- `/phase1` doit bloquer si la phase 0 échoue.

## Règle de correction de portée

Une fois les phases prérequises validées, l'agent peut corriger d'anciens défauts en dehors de la phase cible nominale s'ils bloquent :

- l'implémentation de la phase demandée
- l'intégrité du dépôt
- la suite de validation obligatoire
- `git pull --rebase` ou `git push`

Cette permission s'applique uniquement après la validation des phases prérequises.

## Suite de validation obligatoire

Exécuter les commandes de validation du dépôt correspondant à ces vérifications :

- `build`
- `lint`
- `typecheck`
- `test`
- `validate:openapi`
- `validate:prisma`

Utiliser les points d'entrée du gestionnaire de paquets définis par le dépôt lorsqu'ils sont disponibles.

## Règles Git et de reporting

- Travailler sur `main`.
- Commencer par `git pull --rebase`.
- Terminer par `git push` vers `main`.
- Utiliser des messages de Conventional Commit neutres.
- Ne pas mentionner l'automatisation ou le travail généré dans les messages de commit, sauf si l'utilisateur le demande explicitement.

## Formats de rapport

### Rapport de blocage

Rester concis et n'inclure que :

1. La phase demandée.
2. La première phase prérequise qui a échoué.
3. La porte ou la validation qui a échoué.

### Rapport de complétion

Toujours inclure :

1. Le comportement livré.
2. Les fichiers modifiés.
3. La validation exécutée.
4. Les écarts restants par rapport à la portée.
