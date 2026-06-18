# Catalogue d'événements temps réel

## Objectif
Définir les namespaces WebSocket de base et la stratégie de polling de secours.

## Namespaces

### `matchmaking`
Événements :
- `queue.joined`
- `queue.left`
- `queue.status.updated`
- `match.found`

Charge utile de base :
```json
{
  "playerId": "uuid",
  "mode": "ranked",
  "state": "IN_QUEUE",
  "queuedAt": "2026-03-31T12:00:00Z"
}
```

### `player-status`
Événements :
- `player.online`
- `player.offline`
- `player.in_match`

Charge utile de base :
```json
{
  "playerId": "uuid",
  "status": "ONLINE",
  "updatedAt": "2026-03-31T12:00:00Z"
}
```

### `admin-monitoring`
Événements :
- `kpi.players.active.updated`
- `kpi.matches.daily.updated`
- `kpi.revenue.virtual.updated`
- `kpi.maps.activity.updated`

Charge utile de base :
```json
{
  "metric": "kpi.players.active",
  "value": 1240,
  "window": "24h",
  "updatedAt": "2026-03-31T12:00:00Z"
}
```

## Stratégie de polling de secours
- En cas d'échec de la connexion WebSocket, le frontend utilise les endpoints de polling :
  - `GET /api/v1/matchmaking/queue/status`
  - `GET /api/v1/players/{playerId}/matches`
  - `GET /api/v1/admin/dashboard`
- Intervalle de polling de base :
  - Matchmaking et statut joueur : toutes les 5 secondes.
  - Supervision admin : toutes les 15 secondes.

## Notes de fiabilité
- Reconnexion avec backoff exponentiel.
- Utiliser des gestionnaires d'événements idempotents dans l'état de l'UI.
- Horodater tous les événements en UTC ISO 8601.
