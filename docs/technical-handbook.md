# Manuel Technique

## Résumé de l'architecture

GameDash est un monorepo modulaire construit autour de :

- `apps/web` : surface de démonstration joueur et studio en Next.js.
- `apps/api` : API REST NestJS et passerelles WebSocket.
- `packages/contracts` : DTOs TypeScript partagés.
- `contracts/openapi.yaml` : contrat OpenAPI pour `/api/v1`.
- `prisma/schema.prisma` : modèle de données relationnel de référence.
- `docs` : documentation de périmètre, sécurité, configuration, qualité et livraison.

Le runtime MVP utilise des dépôts en mémoire pour une démonstration rapide. Prisma et OpenAPI restent la source de vérité pour la forme de production persistante visée.

## Contrat API

Chemin de base : `/api/v1`

Groupes d'endpoints principaux :

| Domaine | Routes | Objectif |
|---|---|---|
| Health | `GET /health` | Santé du runtime, uptime, vérifications, métriques requêtes/erreurs. |
| Auth | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` | Cycle de vie du compte et flux de tokens. |
| Joueurs | `/players/me/profile`, `/players/{playerId}/mmr`, `/players/{playerId}/matches`, `/players/{playerId}/progression` | Profil, rangs, historique, progression. |
| Matchmaking | `/matchmaking/queue/join`, `/matchmaking/queue/leave`, `/matchmaking/queue/status` | État de la file et attribution simulée de parties. |
| Parties | `/matches/{matchId}/result` | Soumission du résultat de partie, mise à jour MMR, attribution XP. |
| Économie | `/economy/store/items`, `/economy/wallet`, `/economy/inventory`, `/economy/transactions`, `/economy/transactions/purchase` | Boutique, portefeuille, inventaire, journal d'achats. |
| Cartes | `/maps`, `/maps/{mapId}`, `/maps/{mapId}/versions`, `/maps/{mapId}/votes`, `/maps/{mapId}/tests`, `/maps/{mapId}/favorites` | Cycle de vie des cartes UGC et interactions. |
| Admin | `/admin/dashboard`, `/admin/settings`, `/admin/moderation/*` | KPIs studio, paramétrage, signaux/historique/actions de modération. |

Validation du contrat :

```bash
corepack pnpm validate:openapi
```

## Contrat d'erreur

Toutes les erreurs API utilisent la même enveloppe :

```json
{
  "error": {
    "code": "unauthorized",
    "message": "Bearer token is required.",
    "statusCode": 401,
    "timestamp": "2026-06-12T20:57:42.367Z",
    "path": "/api/v1/auth/me",
    "requestId": "request-id"
  }
}
```

L'API émet ou propage également `x-request-id` pour la traçabilité.

## Modèle de données de référence

Les modèles Prisma couvrent les domaines MVP :

- Identité : `User`, `PlayerProfile`, `RefreshToken`.
- Boucle compétitive : `QueueEntry`, `Match`, `MatchParticipant`, `PlayerMmr`, `RankConfig`.
- Progression : `AccountProgression`, `LevelReward`, `PlayerRewardGrant`.
- Économie : `Wallet`, `StoreItem`, `Transaction`, `InventoryItem`.
- Cartes UGC : `GameMap`, `MapVersion`, `MapVote`, `MapTest`, `MapFavorite`, `MapReport`, `MapModerationEvent`.
- Studio : `Sanction`, `StudioSetting`, `ModerationSignal`, `ModerationHistory`, `AuditLog`.
- Observabilité : `RuntimeEvent`.

Validation du schéma :

```bash
corepack pnpm validate:prisma
```

## Modèle de sécurité

Rôles :

- `player` : profil joueur, file d'attente, partie, économie, progression, interactions avec les cartes.
- `staff` : lecture des surfaces studio et application des actions de modération.
- `admin` : permissions staff plus mises à jour des paramètres studio.

Contrôles de sécurité :

- Hachage des mots de passe PBKDF2-SHA512.
- Tokens d'accès signés HMAC.
- Refresh tokens stockés sous forme de hachages et pivotés/révoqués.
- Guards Nest pour l'authentification et les périmètres de rôles.
- Pipe de validation global avec rejet des champs inconnus.
- Enveloppe d'erreur API standard.
- Journaux d'audit pour les actions critiques d'authentification, de profil, de MMR, d'XP, d'économie, de cartes, de paramètres et de modération.

Voir `docs/security-baseline.md` pour le référentiel complet.

## Configuration locale

Installer les dépendances :

```bash
corepack pnpm install
```

Lancer l'API :

```bash
corepack pnpm --filter @gamedash/api dev
```

Lancer le frontend :

```bash
corepack pnpm --filter @gamedash/web dev
```

Vérification de santé :

```bash
Invoke-RestMethod http://localhost:3001/api/v1/health
```

Frontend :

```text
http://localhost:3000
```

## Suite de validation obligatoire

À exécuter avant toute livraison :

```bash
corepack pnpm build
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm validate:openapi
corepack pnpm validate:prisma
```

## Actions de consolidation pour la production

- Remplacer les services en mémoire par des dépôts Prisma.
- Ajouter des migrations et des données d'amorçage.
- Persister les `RuntimeEvent` et les journaux d'audit.
- Ajouter l'exécution CI pour la suite de validation obligatoire.
- Ajouter des tests end-to-end navigateur sur les applications en cours d'exécution.
- Ajouter la pagination et le filtrage basé sur la base de données pour les endpoints de liste.
