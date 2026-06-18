# Référence API — GameDash

> URL de base : `http://localhost:3001/api/v1`  
> Tous les endpoints authentifiés nécessitent l'en-tête `Authorization: Bearer <access_token>`.  
> Format de l'enveloppe d'erreur : `{ "error": { "code", "message", "statusCode", "timestamp", "path", "requestId" } }`

---

## Authentification

### POST /auth/register

Créer un nouveau compte joueur.

**Auth :** aucune

**Corps de la requête :**
```json
{
  "email": "player@example.com",
  "password": "SecurePass123!",
  "pseudo": "PlayerOne"
}
```

**Réponse 201 :**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "player@example.com",
    "role": "PLAYER"
  }
}
```

**Erreurs :** `400` payload invalide, `409` adresse e-mail déjà utilisée

---

### POST /auth/login

S'authentifier et recevoir les tokens JWT.

**Auth :** aucune

**Corps de la requête :**
```json
{
  "email": "player@example.com",
  "password": "SecurePass123!"
}
```

**Réponse 200 :**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "player@example.com",
    "role": "PLAYER"
  }
}
```

**Erreurs :** `400` payload invalide, `401` identifiants incorrects

---

### POST /auth/refresh

Renouveler le refresh token et obtenir un nouvel access token.

**Auth :** aucune

**Corps de la requête :**
```json
{ "refreshToken": "eyJ..." }
```

**Réponse 200 :** identique à la réponse de connexion

**Erreurs :** `401` token invalide / révoqué / expiré

---

### POST /auth/logout

Révoquer le refresh token courant.

**Auth :** Bearer token

**Corps de la requête :**
```json
{ "refreshToken": "eyJ..." }
```

**Réponse 200 :** `{ "success": true }`

---

### GET /auth/me

Retourner l'identité de l'utilisateur authentifié.

**Auth :** Bearer token

**Réponse 200 :**
```json
{
  "id": "uuid",
  "email": "player@example.com",
  "role": "PLAYER",
  "state": "OFFLINE"
}
```

---

## Joueurs

### GET /players/me/profile

Retourner le profil du joueur courant.

**Auth :** Bearer token

**Réponse 200 :**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "pseudo": "PlayerOne",
  "avatarUrl": null,
  "region": "EU",
  "bio": null
}
```

---

### PATCH /players/me/profile

Mettre à jour le profil du joueur courant.

**Auth :** Bearer token

**Corps de la requête (tous les champs sont optionnels) :**
```json
{
  "pseudo": "NewPseudo",
  "avatarUrl": "https://...",
  "region": "NA",
  "bio": "Hello world"
}
```

**Réponse 200 :** objet profil mis à jour

---

### GET /players/:playerId/mmr

Retourner les notes MMR d'un joueur pour tous les modes de jeu.

**Auth :** Bearer token

**Réponse 200 :**
```json
[
  {
    "mode": "RANKED",
    "mmr": 1250,
    "rankTier": "SILVER",
    "rankDiv": "II"
  },
  {
    "mode": "UNRANKED",
    "mmr": 1000,
    "rankTier": "BRONZE",
    "rankDiv": "I"
  }
]
```

---

### GET /players/:playerId/matches

Retourner l'historique des matchs d'un joueur.

**Auth :** Bearer token

**Réponse 200 :**
```json
[
  {
    "matchId": "uuid",
    "mode": "RANKED",
    "format": "ONE_VS_ONE",
    "outcome": "WIN",
    "mmrBefore": 1225,
    "mmrAfter": 1250,
    "xpAwarded": 120,
    "startedAt": "2026-06-15T14:00:00Z",
    "finishedAt": "2026-06-15T14:20:00Z"
  }
]
```

---

### GET /players/:playerId/progression

Retourner la progression XP et de niveau.

**Auth :** Bearer token

**Réponse 200 :**
```json
{
  "level": 12,
  "lifetimeXp": 4800,
  "xpToNextLevel": 200,
  "recentRewards": [
    {
      "level": 10,
      "label": "Silver Frame",
      "rewardType": "COSMETIC",
      "grantedAt": "2026-06-10T09:00:00Z"
    }
  ]
}
```

---

## Matchmaking

### POST /matchmaking/queue/join

Rejoindre la file d'attente de matchmaking.

**Auth :** Bearer token

**Corps de la requête :**
```json
{ "mode": "RANKED" }
```

`mode` : `RANKED` | `UNRANKED` | `FUN`

**Réponse 201 :**
```json
{
  "queueId": "uuid",
  "mode": "RANKED",
  "state": "IN_QUEUE",
  "queuedAt": "2026-06-18T10:00:00Z"
}
```

**Erreurs :** `409` joueur déjà en file d'attente

---

### POST /matchmaking/queue/leave

Quitter la file d'attente de matchmaking.

**Auth :** Bearer token

**Réponse 200 :** `{ "success": true }`

---

### GET /matchmaking/queue/status

Vérifier le statut actuel de la file d'attente.

**Auth :** Bearer token

**Réponse 200 :**
```json
{
  "inQueue": true,
  "mode": "RANKED",
  "state": "IN_QUEUE",
  "queuedAt": "2026-06-18T10:00:00Z",
  "estimatedWait": 45
}
```

---

## Matchs

### POST /matches/:matchId/result

Soumettre le résultat d'un match. Déclenche la mise à jour du MMR, l'attribution de XP et le crédit du portefeuille.

**Auth :** Bearer token

**Corps de la requête :**
```json
{
  "winnerUserId": "uuid",
  "participants": [
    { "userId": "uuid", "outcome": "WIN", "team": 1 },
    { "userId": "uuid", "outcome": "LOSS", "team": 2 }
  ],
  "resultNotes": "optional"
}
```

**Réponse 200 :**
```json
{
  "matchId": "uuid",
  "finishedAt": "2026-06-18T10:30:00Z",
  "participants": [
    {
      "userId": "uuid",
      "outcome": "WIN",
      "mmrBefore": 1225,
      "mmrAfter": 1250,
      "xpAwarded": 120
    }
  ]
}
```

**Effets de bord :**
- Met à jour `PlayerMmr` pour chaque participant (`+25` WIN, `-25` LOSS, `+5` DRAW)
- Met à jour `AccountProgression.lifetimeXp` — peut déclencher une montée de niveau
- Accorde `LevelReward` si un nouveau niveau est atteint (idempotent via la contrainte unique `PlayerLevelRewardGrant`)
- Attribue la monnaie virtuelle via `Transaction` + crédit `Wallet`

**Erreurs :** `403` le soumetteur n'est pas un participant, `404` match introuvable, `409` résultat déjà soumis

---

## Économie

### GET /economy/store/items

Lister les articles actifs de la boutique.

**Auth :** Bearer token

**Réponse 200 :**
```json
[
  {
    "id": "uuid",
    "itemCode": "SKIN_FIRE",
    "name": "Fire Skin",
    "description": "Flames on your character",
    "currencyType": "SOFT",
    "price": 500,
    "active": true
  }
]
```

---

### GET /economy/wallet

Retourner les soldes actuels du portefeuille.

**Auth :** Bearer token

**Réponse 200 :**
```json
{
  "softBalance": 1200,
  "hardBalance": 50
}
```

---

### POST /economy/transactions/purchase

Acheter un article de la boutique.

**Auth :** Bearer token

**Corps de la requête :**
```json
{
  "itemCode": "SKIN_FIRE",
  "quantity": 1
}
```

**Réponse 201 :**
```json
{
  "transactionId": "uuid",
  "status": "ACCEPTED",
  "itemCode": "SKIN_FIRE",
  "currencyType": "SOFT",
  "amount": 500,
  "balanceBefore": 1200,
  "balanceAfter": 700
}
```

**Flux de transaction :**
1. Vérifier que l'article existe et est actif
2. Vérifier que le solde du portefeuille est >= `price * quantity`
3. Écrire l'enregistrement `Transaction` (registre en ajout seul)
4. Débiter le solde du `Wallet`
5. Upsert de `InventoryItem` (incrémenter la quantité en cas de doublon)

**Erreurs :** `400` solde insuffisant, `404` article introuvable, `409` article inactif

---

### GET /economy/transactions

Retourner l'historique des transactions du joueur courant.

**Auth :** Bearer token

**Réponse 200 :** tableau d'objets transaction avec `createdAt`, `status`, `amount`, `currencyType`, `itemCode`

---

### GET /economy/inventory

Retourner l'inventaire du joueur courant.

**Auth :** Bearer token

**Réponse 200 :**
```json
[
  {
    "itemCode": "SKIN_FIRE",
    "name": "Fire Skin",
    "quantity": 1,
    "equipped": false
  }
]
```

---

## Cartes

### GET /maps

Lister les cartes publiées. Les cartes `HIDDEN` sont exclues sauf si le filtre `status=hidden` est fourni par le staff/admin.

**Auth :** Bearer token

**Paramètres de requête :** `status`, `tags`, `search`, `page`, `limit`

**Réponse 200 :** tableau paginé de `MapSummary`

---

### POST /maps

Créer une nouvelle carte.

**Auth :** Bearer token

**Corps de la requête :**
```json
{
  "title": "Lava Canyon",
  "description": "Hot zone map",
  "tags": ["competitive", "3v3"],
  "status": "DRAFT"
}
```

**Réponse 201 :** `MapDetailResponse`

---

### GET /maps/:mapId

Retourner le détail complet d'une carte.

**Auth :** Bearer token

**Réponse 200 :** `MapDetailResponse` incluant les versions, le nombre de votes, de tests et les favoris

---

### POST /maps/:mapId/versions

Ajouter une nouvelle version à une carte.

**Auth :** Bearer token (créateur de la carte uniquement)

**Corps de la requête :**
```json
{
  "versionLabel": "v1.2",
  "releaseNotes": "Fixed spawn points"
}
```

---

### POST /maps/:mapId/votes

Voter ou mettre à jour son vote sur une carte.

**Auth :** Bearer token

**Corps de la requête :** `{ "value": 1 }` (1 = vote positif, -1 = vote négatif)

---

### POST /maps/:mapId/favorites

Ajouter ou retirer une carte des favoris.

**Auth :** Bearer token

---

### POST /maps/:mapId/tests

Enregistrer une session de test de carte.

**Auth :** Bearer token

---

## Administration

> Tous les endpoints d'administration nécessitent le rôle `ADMIN` ou `STAFF`. La modification des paramètres nécessite le rôle `ADMIN`.

### GET /admin/dashboard

Retourner les KPI de la plateforme.

**Auth :** Bearer token (ADMIN ou STAFF)

**Réponse 200 :**
```json
{
  "totalPlayers": 1240,
  "activeSessions": 38,
  "matchesToday": 412,
  "openReports": 7,
  "revenueToday": 8400
}
```

---

### GET /admin/settings

Retourner toutes les paires clé-valeur de `StudioSetting`.

**Auth :** Bearer token (ADMIN ou STAFF)

---

### PATCH /admin/settings

Mettre à jour un paramètre du studio.

**Auth :** Bearer token (ADMIN uniquement)

**Corps de la requête :**
```json
{
  "key": "mmr_delta_win",
  "value": 30
}
```

---

### GET /admin/moderation/signals

Lister les signaux de modération ouverts.

**Auth :** Bearer token (ADMIN ou STAFF)

---

### POST /admin/moderation/actions

Appliquer une action de modération (bannissement, suspension, avertissement).

**Auth :** Bearer token (ADMIN ou STAFF)

**Corps de la requête :**
```json
{
  "targetType": "player",
  "targetId": "uuid",
  "action": "BAN",
  "reason": "Cheating",
  "endsAt": null
}
```

**Effets de bord :**
- Crée un enregistrement `Sanction`
- Crée une entrée `ModerationHistory`
- Écrit une entrée `AuditLog`

---

### GET /admin/moderation/history

Retourner l'historique des actions de modération.

**Auth :** Bearer token (ADMIN ou STAFF)

---

## Santé

### GET /health

Retourner le statut de santé de l'API et les métriques d'exécution.

**Auth :** aucune

**Réponse 200 :**
```json
{
  "status": "ok",
  "uptime": 3600,
  "requestCount": 12450,
  "errorCount": 3,
  "timestamp": "2026-06-18T10:00:00Z"
}
```

---

## Événements WebSocket

Connexion : `ws://localhost:3001` avec l'en-tête `Authorization` ou le paramètre de requête `token`.

| Namespace | Événement (client→serveur) | Événement (serveur→client) | Description |
|---|---|---|---|
| `/matchmaking` | `queue:join` | `queue:matched` | Joueur trouvé, réception des données du match |
| `/matchmaking` | `queue:leave` | `queue:status` | Mise à jour de la position en file d'attente |
| `/status` | — | `player:status` | Diffusion des changements de QueueState |
| `/admin` | — | `admin:stats` | Métriques de la plateforme en temps réel (ADMIN uniquement) |
