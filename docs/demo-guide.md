# Demo Guide and Video Script

## Goal

Show that GameDash is a complete MVP with a player loop, studio loop, technical quality baseline, and final delivery documentation.

Target duration: 8 to 12 minutes.

## Preparation

Run the validation suite before recording or presenting:

```bash
corepack pnpm build
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm validate:openapi
corepack pnpm validate:prisma
```

Start the apps:

```bash
corepack pnpm --filter @gamedash/api dev
corepack pnpm --filter @gamedash/web dev
```

Open:

- Web: `http://localhost:3000`
- API health: `http://localhost:3001/api/v1/health`

## Live demo sequence

### 1. Introduce the product

Script:

> GameDash is a web platform for a competitive online game. It covers the player experience and the studio backoffice in one MVP: account, matchmaking, progression, economy, community maps, monitoring, settings, and moderation.

Show:

- `docs/final-delivery.md`
- `docs/01-analyse-cahier-des-charges.md`
- `docs/03-roadmap-gamedash.md`

### 2. Show repository health

Script:

> The project is validated through a mandatory quality suite: build, lint, typecheck, tests, OpenAPI validation, and Prisma validation.

Show:

- terminal validation output
- `docs/phase-gates.md`
- `docs/quality-security-hardening.md`

### 3. Show the player surface

Script:

> The player loop starts with identity, then moves into matchmaking, match results, MMR, XP, levels, economy, inventory, and UGC maps.

Show in web:

- Create account panel
- Session contract
- Protected routes
- Matchmaking card
- MMR card
- Recent matches
- Account progression
- Wallet/store/inventory
- Community maps and UGC activity

### 4. Show the studio surface

Script:

> The studio can observe activity, tune matchmaking/MMR/economy, and handle moderation.

Show in web:

- Studio dashboard
- Studio settings
- Moderation signals
- Moderation history

### 5. Show API and observability

Script:

> The API exposes a health endpoint with runtime checks and request/error metrics. Errors carry a request id so failures are traceable.

Show:

- `GET /api/v1/health`
- error envelope example from `docs/technical-handbook.md`
- `docs/security-baseline.md`

### 6. Show data model and contracts

Script:

> OpenAPI and Prisma define the stable API and database baselines. The runtime is in-memory for the MVP demo, but the persistence target is already modeled.

Show:

- `contracts/openapi.yaml`
- `prisma/schema.prisma`
- `packages/contracts/src/http.ts`
- `docs/technical-handbook.md`

### 7. Close with viability and next steps

Script:

> The MVP is demonstrable and covers the main product risks. The next production steps are persistence wiring, migrations, durable audit/observability, CI, and deeper analytics.

Show:

- `docs/business-viability-checklist.md`
- `docs/risk-register.md`
- `docs/performance-baseline.md`

## Video recording checklist

- Browser zoom is readable.
- Terminal command output is visible.
- No local secrets or tokens are shown.
- Start from `docs/final-delivery.md`.
- End on the validation result and viability checklist.

## Fallback if live runtime fails

If the live app cannot start during the defense:

1. Show the last green validation commands.
2. Show the web source panel in `apps/web/src/app/page.tsx`.
3. Show API controllers in `apps/api/src`.
4. Show OpenAPI and Prisma validation outputs.
5. Continue with the documentation-driven demo sequence.
