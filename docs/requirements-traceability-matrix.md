# Matrice de traçabilité des exigences

## Objectif

Cette matrice met en correspondance les attentes du cahier des charges avec des preuves concrètes dans le dépôt. Elle est conçue pour la revue finale et les questions rapides du jury.

## Traçabilité

| Exigence | Preuve | Validation | Preuve de démo | Statut |
|---|---|---|---|---|
| Création de compte joueur et connexion | `apps/api/src/auth`, `contracts/openapi.yaml`, `packages/contracts/src/http.ts`, `prisma/schema.prisma` | `corepack pnpm test`, `corepack pnpm typecheck` | Panneau inscription/connexion et contrat auth | Couvert |
| Limites de rôles pour player, staff, admin | `apps/api/src/auth/roles.guard.ts`, contrôleurs admin, `docs/security-baseline.md` | `corepack pnpm test` | Explication des routes admin/staff protégées | Couvert |
| Baseline du profil joueur | `apps/api/src/players`, modèle `PlayerProfile`, routes joueur OpenAPI | `corepack pnpm validate:openapi`, `corepack pnpm validate:prisma` | Carte de profil joueur | Couvert |
| Files d'attente de matchmaking | `apps/api/src/matchmaking`, DTOs de matchmaking, routes OpenAPI de file d'attente | `corepack pnpm test` | Carte de matchmaking et statut de file d'attente | Couvert |
| Résultat de match et mise à jour MMR | `apps/api/src/matchmaking`, `apps/api/src/matches`, modèle `PlayerMmr` | `corepack pnpm test` | Vue MMR/rang et historique des matchs | Couvert |
| XP, niveaux et récompenses | `apps/api/src/progression`, DTOs de progression, modèles de progression Prisma | `corepack pnpm test` | Carte de progression | Couvert |
| Boutique, portefeuille, inventaire | `apps/api/src/economy`, DTOs d'économie, modèles portefeuille/boutique/inventaire | `corepack pnpm test` | Vue boutique, portefeuille, inventaire | Couvert |
| Traçabilité des transactions | Journal des transactions d'économie, modèle `Transaction`, règles d'audit | `corepack pnpm test`, `corepack pnpm validate:prisma` | Explication achat accepté/rejeté | Couvert |
| Publication de map UGC | `apps/api/src/maps`, DTOs de map, modèle `GameMap` | `corepack pnpm test` | Panneau maps communautaires | Couvert |
| Versions de map et notes de version | Endpoint de version de map, modèle `MapVersion`, routes OpenAPI de map | `corepack pnpm validate:openapi` | Explication du versionnage de map | Couvert |
| Votes, tests, favoris, recherche | Service de maps, contrats, OpenAPI, modèles d'interaction de map Prisma | `corepack pnpm test` | Explication de l'activité map et de la recherche | Couvert |
| Popularité et statistiques créateur | Statistiques dérivées du service de maps, `docs/mvp-scope.md` | `corepack pnpm test` | Explication des statistiques créateur/map | Couvert |
| KPIs du tableau de bord studio | `apps/api/src/admin`, DTOs admin, routes OpenAPI admin | `corepack pnpm test` | Panneau tableau de bord studio | Couvert |
| Paramètres studio | Endpoints de paramètres admin, modèle `StudioSetting` | `corepack pnpm test` | Explication du réglage matchmaking/MMR/économie | Couvert |
| Modération de comptes et de maps | Endpoints de modération admin, modèles de modération, règles d'audit | `corepack pnpm test` | Panneau signaux/historique de modération | Couvert |
| Journalisation d'audit des actions critiques | Baseline de sécurité, entrées d'audit de service, modèle Prisma `AuditLog` | `corepack pnpm test` | Montrer la couverture des tests de flux critiques | Couvert |
| API sous `/api/v1` | Bootstrap Nest et chemins OpenAPI | `corepack pnpm validate:openapi` | Santé API et exemples de routes | Couvert |
| Erreur standard et identifiant de requête | Middleware/filtre d'observabilité, handbook technique | `corepack pnpm test` | Exemple d'enveloppe d'erreur | Couvert |
| Santé runtime et diagnostics | `apps/api/src/health`, service d'observabilité, modèle `RuntimeEvent` | `corepack pnpm test` | `GET /api/v1/health` | Couvert |
| Comportement de fallback temps réel | `apps/api/src/realtime`, `docs/event-catalog.md` | `corepack pnpm typecheck` | Expliquer le fallback par polling | Couvert |
| Documentation technique | `docs/technical-handbook.md`, `docs/local-setup-native.md` | Revue documentaire | Ouvrir les docs pendant la soutenance | Couvert |
| Plan de sécurité et de conformité | `docs/security-baseline.md`, `docs/quality-security-hardening.md` | Revue documentaire | Points de discours sécurité | Couvert |
| Guide utilisateur | `docs/user-guide.md` | Revue documentaire | Explication du parcours utilisateur | Couvert |
| Préparation démo et soutenance | `docs/demo-guide.md`, `docs/soutenance-runbook.md` | Revue documentaire | Séquence de démo en direct | Couvert |
| Viabilité business | `docs/business-viability-checklist.md` | Revue documentaire | Explication de la valeur produit et des risques | Couvert |

## Stratégie de lecture pour le jury

Utiliser cette matrice comme pont entre l'exigence et la preuve. Si une question remet en cause une fonctionnalité, montrer la ligne correspondante, puis ouvrir le fichier de preuve et la commande de validation.
