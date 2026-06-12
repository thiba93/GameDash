# User Guide

## Audience

This guide explains the MVP from the point of view of the two primary user groups:

- Player.
- Studio staff or admin.

## Player journey

### 1. Create an account

The player starts from the account creation panel:

- email
- password
- pseudo
- region
- optional profile metadata

Expected result:

- a player account is created
- the default role is `player`
- access and refresh tokens are issued
- the profile baseline is available

### 2. Review session and protected routes

The session panel shows:

- current role
- profile pseudo
- revocable refresh-token behavior

Protected routes require a bearer token. Admin routes require `staff` or `admin`.

### 3. Enter matchmaking

The player can join a queue for:

- ranked
- unranked
- fun

The MVP simulates match attribution when two players join the same queue mode.

Expected result:

- player state moves from `online` to `in_queue`
- when matched, player state moves to `in_match`
- a match id and opponent id are available

### 4. Submit a result and view progression

After result submission:

- MMR is updated.
- Rank is recalculated.
- XP is awarded.
- Level progression is updated.
- level-up rewards are granted once.
- audit entries are written for MMR and XP changes.

The web surface shows:

- current MMR by mode
- recent match history
- rank map
- account level and XP progress
- granted and upcoming rewards

### 5. Use economy features

The player can review:

- wallet balances
- store catalog
- inventory
- transaction journal

Purchases are simulated with in-app currency only. No real payment provider is used in the MVP.

Expected result:

- accepted purchases debit wallet and grant inventory
- rejected purchases are still journaled
- economy audit entries are written

### 6. Use community maps

The player can:

- create a map
- publish a map as beta or stable
- create versions with release notes
- vote
- mark test completion
- favorite maps
- search maps
- review popularity and creator stats

Hidden maps are excluded from default public browsing.

## Studio staff journey

### 1. Review dashboard KPIs

Staff and admins can review:

- active players
- daily matches
- virtual revenue
- map activity
- moderation signals
- active sanctions

### 2. Review moderation signals

Staff and admins can inspect moderation signals and reports.

Expected result:

- signals remain traceable
- moderation history is append-only

### 3. Moderate accounts and maps

Staff and admins can:

- warn, suspend, or ban accounts
- hide, restore, or feature maps

Expected result:

- moderation action is recorded
- audit entry is written with actor, target, action, reason, and metadata

## Admin journey

Admins can update studio settings for:

- matchmaking queue tuning
- MMR deltas
- economy starter balances and purchase controls

Settings writes are admin-only.

## Support and troubleshooting

If a request fails, use:

- the response `requestId`
- `GET /api/v1/health`
- the standard error envelope
- `docs/quality-security-hardening.md`
- `docs/performance-baseline.md`
