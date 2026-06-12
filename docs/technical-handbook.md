# Technical Handbook

## Architecture summary

GameDash is a modular monorepo built around:

- `apps/web`: Next.js player and studio demonstration surface.
- `apps/api`: NestJS REST API and WebSocket gateways.
- `packages/contracts`: shared TypeScript DTOs.
- `contracts/openapi.yaml`: OpenAPI contract for `/api/v1`.
- `prisma/schema.prisma`: relational data model baseline.
- `docs`: scope, security, setup, quality, and delivery documentation.

The MVP runtime uses in-memory repositories for fast demonstration. Prisma and OpenAPI remain the source of truth for the intended persistent production shape.

## API contract

Base path: `/api/v1`

Core endpoint groups:

| Domain | Routes | Purpose |
|---|---|---|
| Health | `GET /health` | Runtime health, uptime, checks, request/error metrics. |
| Auth | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` | Account lifecycle and token flow. |
| Players | `/players/me/profile`, `/players/{playerId}/mmr`, `/players/{playerId}/matches`, `/players/{playerId}/progression` | Profile, ranks, history, progression. |
| Matchmaking | `/matchmaking/queue/join`, `/matchmaking/queue/leave`, `/matchmaking/queue/status` | Queue state and simulated match attribution. |
| Matches | `/matches/{matchId}/result` | Match result submission, MMR update, XP award. |
| Economy | `/economy/store/items`, `/economy/wallet`, `/economy/inventory`, `/economy/transactions`, `/economy/transactions/purchase` | Store, wallet, inventory, purchase journal. |
| Maps | `/maps`, `/maps/{mapId}`, `/maps/{mapId}/versions`, `/maps/{mapId}/votes`, `/maps/{mapId}/tests`, `/maps/{mapId}/favorites` | UGC map lifecycle and interactions. |
| Admin | `/admin/dashboard`, `/admin/settings`, `/admin/moderation/*` | Studio KPIs, tuning, moderation signals/history/actions. |

Contract validation:

```bash
corepack pnpm validate:openapi
```

## Error contract

All API errors use the same envelope:

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

The API also emits or preserves `x-request-id` for traceability.

## Database model baseline

Prisma models cover the MVP domains:

- Identity: `User`, `PlayerProfile`, `RefreshToken`.
- Competitive loop: `QueueEntry`, `Match`, `MatchParticipant`, `PlayerMmr`, `RankConfig`.
- Progression: `AccountProgression`, `LevelReward`, `PlayerRewardGrant`.
- Economy: `Wallet`, `StoreItem`, `Transaction`, `InventoryItem`.
- UGC maps: `GameMap`, `MapVersion`, `MapVote`, `MapTest`, `MapFavorite`, `MapReport`, `MapModerationEvent`.
- Studio: `Sanction`, `StudioSetting`, `ModerationSignal`, `ModerationHistory`, `AuditLog`.
- Observability: `RuntimeEvent`.

Schema validation:

```bash
corepack pnpm validate:prisma
```

## Security model

Roles:

- `player`: player profile, queue, match, economy, progression, map interactions.
- `staff`: read studio surfaces and apply moderation actions.
- `admin`: staff permissions plus studio settings updates.

Security controls:

- PBKDF2-SHA512 password hashing.
- HMAC-signed access tokens.
- Refresh tokens stored as hashes and rotated/revoked.
- Nest guards for authentication and role boundaries.
- Global validation pipe with unknown field rejection.
- Standard API error envelope.
- Audit logs for critical auth, profile, MMR, XP, economy, map, settings, and moderation actions.

See `docs/security-baseline.md` for the full baseline.

## Local setup

Install dependencies:

```bash
corepack pnpm install
```

Run API:

```bash
corepack pnpm --filter @gamedash/api dev
```

Run web:

```bash
corepack pnpm --filter @gamedash/web dev
```

Health check:

```bash
Invoke-RestMethod http://localhost:3001/api/v1/health
```

Web:

```text
http://localhost:3000
```

## Mandatory validation suite

Run before delivery:

```bash
corepack pnpm build
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm validate:openapi
corepack pnpm validate:prisma
```

## Production hardening follow-up

- Replace in-memory services with Prisma repositories.
- Add migrations and seed data.
- Persist `RuntimeEvent` and audit logs.
- Add CI execution for the mandatory validation suite.
- Add end-to-end browser tests against the running apps.
- Add pagination and database-backed filtering for list endpoints.
