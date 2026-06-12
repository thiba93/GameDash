# Business Viability Checklist

## Product positioning

GameDash targets teams operating a competitive online game with community-created maps. The MVP proves two linked value propositions:

- Players get a visible progression loop and reasons to return.
- Studio teams get enough control and visibility to operate the game safely.

## MVP value checklist

| Area | Evidence | Status |
|---|---|---|
| Player onboarding | Register, login, refresh, logout, profile baseline | Covered |
| Competitive loop | Queue, simulated match attribution, match result, MMR/rank history | Covered |
| Progression | XP, levels, level rewards, progression view | Covered |
| Economy | Wallet, store, purchase, inventory, append-only transactions | Covered |
| UGC maps | Publish, version, vote, test, favorite, search, stats | Covered |
| Studio control | KPIs, settings, moderation signals/history/actions | Covered |
| Safety | RBAC, audit logs, request ids, standard errors | Covered |
| Demonstrability | Validation suite and demo guide | Covered |

## Operational viability

- The studio can identify moderation issues through signals/history.
- Critical actions are auditable.
- Settings allow tuning matchmaking, MMR, and economy behavior.
- API health and runtime metrics give a first diagnostic surface.
- Realtime fallbacks are documented for degraded WebSocket behavior.

## Revenue and economy viability

The MVP does not process real payments. It validates the internal economy loop:

- virtual currencies
- item catalog
- wallet debit
- inventory grant
- accepted and rejected transaction journal
- simulated payment behavior documented as a non-goal for MVP

Production monetization can later connect a real payment processor after legal, security, and compliance review.

## UGC viability

The UGC loop is viable for controlled community content because it includes:

- map statuses
- versions and release notes
- votes, tests, favorites
- popularity scoring
- report/moderation-ready data
- staff moderation actions

Production follow-up should add file storage, automated moderation, and creator reputation metrics.

## Main risks still open

| Risk | Production requirement |
|---|---|
| In-memory runtime state | Replace with Prisma repositories and migrations. |
| No real payment provider | Add payment integration only after compliance review. |
| Limited UI interactivity | Build authenticated role-aware screens over the current contracts. |
| Limited scale testing | Add load tests for queue, maps, purchases, and dashboard. |
| Manual deployment | Add CI/CD and environment-specific configuration. |

## Go/No-Go for final presentation

Go when:

- mandatory validation suite is green
- API health returns `ok`
- web page loads locally
- final delivery docs are present
- demo guide is rehearsed

No-Go when:

- OpenAPI or Prisma validation fails
- build/typecheck/test is red
- request auth or role boundaries are broken
- demo cannot be explained from docs and contracts
