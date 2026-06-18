# Plan de prochaine itération

## Objectif

Faire passer GameDash d'un MVP démontrable à un pilote déployable sans ajouter de portée optionnelle avant que les fondations de production soient solides.

## Ordre de priorité

1. Persistance et données de seed.
2. CI/CD et validation reproductible.
3. Tests E2E navigateur.
4. Frontend tenant compte des rôles connecté à l'API.
5. Audit et observabilité durables.
6. Préparation au déploiement.
7. Analytics approfondies et polish produit.

## Session d'implémentation suivante recommandée

Commencer par la passe de persistance. Cela apporte le gain de qualité le plus important car cela transforme les contrats, services et schéma Prisma existants en comportement durable.

Requête suggérée :

```text
Implemente la phase 10 persistence et seed data, puis lance la suite complete de validation.
```

## Candidat phase 10 - Persistance et données de seed

Objectif : remplacer les repositories en mémoire principaux par une persistance adossée à Prisma pour les flux MVP critiques.

Critères d'acceptation :

- Les utilisateurs Auth, les profils et les jetons de rafraîchissement persistent via Prisma.
- Le matchmaking, les matchs, le MMR, la progression, le portefeuille, l'inventaire, les transactions, les maps, la modération, les audits et les événements runtime ont des frontières de repository durables.
- Les migrations de base de données et les données de seed sont documentées et exécutables.
- Les données de seed de démo couvrent les joueurs, le staff, l'admin, les articles de boutique, les maps, les classements et des exemples de modération.
- Les tests utilisent soit des adaptateurs de repository isolés soit une stratégie de base de données de test documentée.
- La suite de validation complète reste verte.

## Candidat phase 11 - UI connectée tenant compte des rôles et E2E

Objectif : transformer la surface de démonstration actuelle en une UI tenant compte des rôles connectée à des appels API en direct.

Critères d'acceptation :

- L'état de session login/joueur pilote les pages joueur.
- L'état de session staff/admin pilote les pages studio.
- Les formulaires appellent l'API pour les flux de file d'attente, achat, map, paramètres et modération.
- Les états de chargement, vide et d'erreur utilisent l'enveloppe d'erreur API standard.
- Les tests de fumée Playwright couvrent la connexion, la boucle joueur, l'achat, l'interaction avec les maps et la modération admin.

## Candidat phase 12 - Déploiement et opérations

Objectif : rendre le projet déployable en tant que pilote.

Critères d'acceptation :

- GitHub Actions exécute build, lint, typecheck, tests, validation OpenAPI et validation Prisma sur chaque pull request.
- Les contrats de variables d'environnement sont documentés par environnement.
- Les prérequis runtime PostgreSQL et Redis sont explicites.
- Les health checks et les identifiants de requête sont câblés dans les diagnostics de déploiement.
- Les politiques de rétention des audits et des événements runtime sont documentées.

## Discipline de portée

Ne pas démarrer les saisons, les notifications, l'anti-triche avancé ou le traitement de paiements réels tant que les fondations de persistance, CI, E2E et déploiement ne sont pas complètes.
