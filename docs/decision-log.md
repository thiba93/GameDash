# Journal des décisions

## 2026-03-31
- Stack verrouillée : Next.js (web) + NestJS (api).
- Workspace verrouillé : monorepo pnpm + turborepo.
- Stratégie de contrats verrouillée : OpenAPI first + package de contrats TypeScript partagé.
- Base auth verrouillée : email/mot de passe + JWT access/refresh.
- Base de données verrouillée : PostgreSQL + Prisma + Redis.
- Base temps réel verrouillée : namespaces WebSocket avec fallback par polling.
- Qualité cible verrouillée : démo MVP robuste.
- Posture CI verrouillée pour l'instant : pas de CI dans cette phase.

## 2026-04-27
- Le runtime auth de la Phase 1 utilise le stockage en mémoire jusqu'à ce que les repositories Prisma soient branchés lors d'une passe de persistance ultérieure.
- Les mots de passe sont hashés avec PBKDF2-SHA512, les access tokens sont signés avec HMAC, et les refresh tokens sont stockés hashés et révocables.
- L'accès au dashboard admin est restreint aux rôles `staff` et `admin` via les guards Nest.

## 2026-06-11
- Le runtime matchmaking/MMR de la Phase 2 utilise des files d'attente, matchs, classements, historiques et entrées d'audit MMR en mémoire jusqu'à ce que les repositories Prisma soient branchés lors d'une passe de persistance ultérieure.
- Le matchmaking crée un match simulé quand deux joueurs authentifiés rejoignent la même file d'attente en mode.
- Les deltas MMR sont spécifiques au mode pour le MVP : classé (+32/-24), non classé (+10/-8), fun (+5/-4).
- Le mapping de rang est exposé en tant que configuration en lecture seule via l'API joueur de base.
- Le runtime de progression de la Phase 3 utilise la progression de compte en mémoire, la configuration des récompenses de niveau, les attributions de récompenses et les entrées d'audit XP jusqu'à ce que les repositories Prisma soient branchés lors d'une passe de persistance ultérieure.
- L'XP est attribuée à partir des résultats de match acceptés en utilisant l'XP de base du mode plus l'XP bonus de résultat : classé 120, non classé 90, fun 60, victoire 60, match nul 40, défaite 25.
- Les niveaux de compte utilisent des seuils d'XP cumulatifs ; les récompenses de passage de niveau sont attribuées une seule fois par joueur et par code de récompense.
- Les quêtes restent hors périmètre pour la Phase 3 et sont documentées comme périmètre optionnel futur.
- Le runtime économique de la Phase 4 utilise des portefeuilles en mémoire, un catalogue boutique, un inventaire, un journal de transactions append-only et des entrées d'audit d'achat jusqu'à ce que les repositories Prisma soient branchés lors d'une passe de persistance ultérieure.
- Les portefeuilles MVP sont initialisés avec des soldes sandbox : 1000 en monnaie virtuelle et 20 en monnaie premium.
- Le paiement est simulé en débitant uniquement le portefeuille in-app ; aucun processeur de paiement réel ni identifiant de paiement externe n'est requis.
- Les achats refusés sont journalisés pour l'auditabilité et ne mutent pas l'état du portefeuille ou de l'inventaire.
- Le runtime UGC de la Phase 5 utilise des maps en mémoire, des versions, des votes, des tests, des favoris, des stats dérivées et des entrées d'audit de publication/mise à jour jusqu'à ce que les repositories Prisma soient branchés lors d'une passe de persistance ultérieure.
- Le score de popularité des maps est dérivé du score de votes, des tests complétés, des favoris, du nombre de versions et d'un léger bonus de récence.
- La navigation publique des maps masque les maps cachées par défaut ; un filtrage explicite par statut peut récupérer un statut spécifique pour les workflows staff ultérieurs.
- La disponibilité pour la modération est modélisée avec le statut de la map, les métadonnées de révision, les signalements et les événements de modération.
- Le runtime backoffice de la Phase 6 utilise des paramètres studio en mémoire, des actions de modération, des signaux de modération et des entrées d'audit admin jusqu'à ce que les repositories Prisma soient branchés lors d'une passe de persistance ultérieure.
- Les paramètres studio couvrent le réglage des files de matchmaking, les deltas MMR et les contrôles d'achat/solde de l'économie.
- Les écritures de paramètres sont réservées aux admins ; les actions de modération sont disponibles pour le staff et les admins.
- L'historique de modération est append-only dans la base de runtime.
- La Phase 7 standardise les réponses d'erreur API avec des identifiants de requête et enregistre les métriques de requêtes/erreurs en mémoire pour l'observabilité MVP.
- La sortie de santé de la Phase 7 est la surface de diagnostic d'exécution principale jusqu'à l'introduction d'un collecteur de logs en production.
- La Phase 7 maintient la couverture d'intégration des flux critiques au niveau de la composition de services pendant que la persistance reste en mémoire.
- La Phase 7 ajoute une cible de schéma `RuntimeEvent` pour une observabilité durable future sans câbler les écritures en base de données pour l'instant.
- La livraison finale de la Phase 8 commence par `docs/final-delivery.md` et lie les éléments techniques, utilisateur, démo, runbook et viabilité métier.
- La Phase 8 maintient le périmètre de runtime MVP inchangé : services en mémoire démontrables avec OpenAPI et Prisma comme bases de contrats de production.
- La Phase 8 utilise la suite de validation obligatoire comme critère final Go/No-Go pour la soutenance.
- La Phase 9 ajoute des preuves de revue finale sans modifier le périmètre de runtime : disponibilité pour la notation, traçabilité des exigences et la prochaine itération d'implémentation.
- La Phase 9 identifie la persistance, CI/CD, les tests E2E navigateur, l'interface UI role-aware connectée et l'observabilité durable comme les prochaines étapes de production à plus forte valeur ajoutée.
