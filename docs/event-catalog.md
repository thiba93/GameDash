# Realtime Event Catalog

## Purpose
Define baseline WebSocket namespaces and fallback polling strategy.

## Namespaces

### `matchmaking`
Events:
- `queue.joined`
- `queue.left`
- `queue.status.updated`
- `match.found`

Payload baseline:
```json
{
  "playerId": "uuid",
  "mode": "ranked",
  "state": "IN_QUEUE",
  "queuedAt": "2026-03-31T12:00:00Z"
}
```

### `player-status`
Events:
- `player.online`
- `player.offline`
- `player.in_match`

Payload baseline:
```json
{
  "playerId": "uuid",
  "status": "ONLINE",
  "updatedAt": "2026-03-31T12:00:00Z"
}
```

### `admin-monitoring`
Events:
- `kpi.players.active.updated`
- `kpi.matches.daily.updated`
- `kpi.revenue.virtual.updated`
- `kpi.maps.activity.updated`

Payload baseline:
```json
{
  "metric": "kpi.players.active",
  "value": 1240,
  "window": "24h",
  "updatedAt": "2026-03-31T12:00:00Z"
}
```

## Fallback polling strategy
- If WebSocket connection fails, frontend uses polling endpoints:
  - `GET /api/v1/matchmaking/queue/status`
  - `GET /api/v1/players/{playerId}/matches`
  - `GET /api/v1/admin/dashboard`
- Polling interval baseline:
  - Matchmaking and player status: every 5 seconds.
  - Admin monitoring: every 15 seconds.

## Reliability notes
- Reconnect with exponential backoff.
- Use idempotent event handlers in UI state.
- Timestamp all events in UTC ISO 8601 format.
