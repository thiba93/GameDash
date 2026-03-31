# GameDash

GameDash is a unified platform for a competitive online game with community map content.
This repository is prepared as a coding-ready monorepo for Codex execution.

## Product goal
- Player surface: account, progression, matchmaking, economy, maps.
- Studio surface: monitoring, balancing, moderation, economy, UGC oversight.

## Locked technical baseline
- Monorepo: `pnpm` + `turborepo`
- Web app: Next.js (`apps/web`)
- API app: NestJS (`apps/api`)
- Shared contracts: `packages/contracts`
- Data model baseline: Prisma schema (`prisma/schema.prisma`)
- API baseline: OpenAPI (`contracts/openapi.yaml`)
- API versioning: `/api/v1`
- Realtime baseline: WebSocket namespaces + polling fallback

## Current milestone
Phase 0: project foundation and executable governance.

## Repository layout
- `apps/web`: player/studio frontend shell
- `apps/api`: REST + WebSocket backend shell
- `packages/contracts`: shared DTO and payload types
- `contracts`: OpenAPI contracts
- `prisma`: DB schema baseline
- `docs`: product, security, risk, backlog, events, setup
- `.codex`: project Codex skill and project config

## Main commands
```bash
pnpm.cmd install
pnpm.cmd dev
pnpm.cmd build
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd test
pnpm.cmd validate:openapi
pnpm.cmd validate:prisma
pnpm.cmd validate:contracts
```

## Local run (minimal)
1. Copy `.env.example` values where needed.
2. Start API: `pnpm.cmd --filter @gamedash/api dev`
3. Start Web: `pnpm.cmd --filter @gamedash/web dev`
4. Health check: `GET http://localhost:3001/api/v1/health`

## Governance entrypoints
- Execution rules for agents: `AGENTS.md`
- Product scope: `docs/mvp-scope.md`
- Executable backlog: `docs/backlog-mvp.md`
- Security baseline: `docs/security-baseline.md`
- Decision log: `docs/decision-log.md`
