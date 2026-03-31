# Backlog MVP - Vertical Slices

## Slice 1 - Auth baseline
Status: ready
- API: register/login/refresh/logout endpoints.
- Schema: user, profile, refresh token.
- Contracts: auth request/response DTOs.
- Validation: auth route smoke tests + typecheck.

## Slice 2 - Matchmaking and MMR baseline
Status: ready
- API: queue join/leave/status.
- API: match result submit.
- API: player mmr and match history.
- Schema: queue entry, match, participant, player mmr.
- Contracts: queue/match/mmr DTOs.

## Slice 3 - Economy baseline
Status: ready
- API: store items, wallet, purchase transaction.
- Schema: wallet, store item, transaction, inventory item.
- Contracts: wallet/store/purchase DTOs.

## Slice 4 - UGC maps baseline
Status: ready
- API: create map, add version, vote, test, list maps.
- Schema: map, map version, vote, test, favorite.
- Contracts: map creation/version/vote/test DTOs.

## Slice 5 - Admin and observability baseline
Status: ready
- API: admin dashboard placeholder.
- Schema: sanctions, moderation events, audit log.
- Realtime: event catalog namespaces and fallback docs.
- Contracts: admin summary and moderation DTOs.

## Definition of done for every slice
- OpenAPI updated.
- Prisma schema updated.
- Contracts package updated.
- API endpoints wired and buildable.
- Lint and typecheck passing.
- Scope and security docs updated if behavior changes.
