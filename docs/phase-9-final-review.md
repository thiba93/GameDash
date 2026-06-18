# Phase 9 - Revue finale et préparation à la notation

## Objectif

La phase 9 est la dernière couche qualité du projet d'étude. Elle n'ajoute pas de portée produit risquée. Elle transforme le cahier des charges, la feuille de route, les portes de validation et le package de livraison en un fichier de preuves clair pour le jury.

## Revue des sources

- `Cahier des Charges.pdf` : aucun barème numérique explicite basé sur des points n'a été trouvé dans le texte extractible. Le matériel évaluable est l'ensemble des objectifs, innovations, rôles et livrables attendus.
- `docs/01-analyse-cahier-des-charges.md` : définit les critères d'acceptation du MVP.
- `docs/03-roadmap-gamedash.md` : définit la portée des phases et les résultats attendus.
- `docs/phase-gates.md` : définit les portes de réussite/échec objectives.
- `docs/final-delivery.md` : référence le package de revue finale.

## Axes d'évaluation

| Axe | Preuve attendue | Statut actuel | Action de soutenance |
|---|---|---|---|
| MVP fonctionnel | Boucle joueur, boucle studio, économie, maps UGC | Couvert pour le MVP | Démo de la surface web, puis montrer les endpoints OpenAPI et les tests critiques. |
| Architecture technique | Backend modulaire, application web, contrats, cible de base de données | Couvert | Montrer les modules Nest, l'application Next, les contrats partagés, OpenAPI et Prisma. |
| Sécurité et conformité | Auth, RBAC, hachage de mots de passe, journaux d'audit, hygiène des secrets | Couvert pour le MVP | Montrer `docs/security-baseline.md` et expliquer les contrôles de production restants. |
| Modèle de données | Joueurs, matchs, MMR, transactions, maps, modération | Couvert comme baseline Prisma | Montrer `prisma/schema.prisma` et expliquer le runtime MVP en mémoire. |
| Qualité de l'API | API REST versionnée, payloads stables, validation de contrat | Couvert | Montrer `/api/v1`, `contracts/openapi.yaml` et `validate:openapi`. |
| Qualité logicielle | Build, lint, typecheck, tests, vérifications de contrat | Couvert | Exécuter ou montrer la suite de validation obligatoire. |
| UX et visualisation | Tableau de bord joueur, tableau de bord studio, démo lisible | Couvert comme baseline de démo | Montrer les surfaces joueur et studio, puis indiquer le suivi UI de production. |
| Viabilité business | Proposition de valeur, risques, prochaines étapes de production | Couvert | Montrer `docs/business-viability-checklist.md` et le plan de prochaine itération. |
| Gestion de projet | Feuille de route, portes de phase, décisions, risques | Couvert | Montrer la feuille de route, les portes, le journal de décisions et le registre des risques. |
| Package de livraison | Docs techniques, guide utilisateur, guide de démo, runbook de soutenance | Couvert | Commencer par `docs/final-delivery.md`. |

## Risques résiduels de notation

Ce ne sont pas des bloqueurs pour une soutenance MVP réussie, mais ce sont les points les plus susceptibles d'être contestés.

| Risque | Pourquoi c'est important | Réponse pour le jury | Prochaine itération |
|---|---|---|---|
| La persistance runtime est en mémoire | Une application de production a besoin de données durables | Le MVP prouve le comportement et les contrats ; Prisma est déjà la cible de persistance | Câbler les repositories Prisma, les migrations et les données de seed. |
| Pas de pipeline CI/CD | La validation manuelle peut être oubliée | La suite complète est scriptée et documentée ; le CI est la prochaine étape opérationnelle | Ajouter GitHub Actions pour build, lint, typecheck, tests, OpenAPI, Prisma. |
| L'UI est une surface démontrable | Un vrai produit nécessite des écrans interactifs authentifiés | Le MVP montre tous les domaines et les contrats API sont complets | Connecter les écrans tenant compte des rôles aux flux API en direct. |
| Pas de vrai fournisseur de paiement | Les paiements réels nécessitent une conformité | Le cahier autorise un service sandbox/simulé ; le débit du portefeuille et l'intégrité des transactions sont validés | Ajouter un fournisseur uniquement après revue légale/sécurité. |
| Pas de suite E2E navigateur | Les tests unitaires/service ne prouvent pas les parcours complets en navigateur | Les flux critiques sont couverts dans les tests API et le guide de démo couvre le E2E manuel | Ajouter des tests de fumée Playwright. |

## Schéma de preuve pour la soutenance

Pour chaque question du jury, répondre dans cet ordre :

1. Exigence issue du cahier des charges.
2. Preuve dans le code, le contrat, le schéma, le test ou la documentation.
3. Commande de validation prouvant que la preuve est toujours saine.
4. Limite honnête du MVP et le suivi de production prévu.

## Recommandation finale

Le projet est prêt pour une présentation MVP à haute note lorsque la suite de validation obligatoire est verte et que la démo suit ce parcours :

1. Commencer par `docs/final-delivery.md`.
2. Montrer la traçabilité avec `docs/requirements-traceability-matrix.md`.
3. Exécuter ou présenter la suite de validation.
4. Faire la démo des surfaces joueur et studio.
5. Conclure avec `docs/business-viability-checklist.md` et `docs/next-iteration-plan.md`.
