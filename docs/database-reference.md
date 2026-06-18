# Référence Base de Données — GameDash

> Moteur : PostgreSQL  
> ORM : Prisma 5.22  
> Schéma : `prisma/schema.prisma`  
> Migrations : `prisma/migrations/`

---

## Énumérations

| Énumération | Valeurs | Usage |
|---|---|---|
| `Role` | `PLAYER`, `STAFF`, `ADMIN` | Niveau de permission de l'utilisateur |
| `GameMode` | `RANKED`, `UNRANKED`, `FUN` | Contexte de match et de file d'attente |
| `QueueState` | `OFFLINE`, `ONLINE`, `IN_QUEUE`, `IN_MATCH` | État du joueur en temps réel |
| `MatchOutcome` | `WIN`, `LOSS`, `DRAW` | Résultat par participant |
| `MatchFormat` | `ONE_VS_ONE`, `THREE_VS_THREE` | Structure du match |
| `CurrencyType` | `SOFT`, `HARD` | Canal de devise du portefeuille |
| `TransactionStatus` | `ACCEPTED`, `REJECTED` | Résultat d'un achat |
| `RewardType` | `SOFT_CURRENCY`, `COSMETIC`, `TITLE` | Type de récompense de montée de niveau |
| `MapStatus` | `DRAFT`, `BETA`, `STABLE`, `HIDDEN` | Étape du cycle de vie d'une carte UGC |
| `SanctionType` | `WARNING`, `SUSPENSION`, `BAN` | Gravité de l'action de modération |

---

## Tables

### User

Enregistrement d'identité central. Toutes les tables de domaine effectuent une suppression en cascade lors de la suppression d'un utilisateur.

| Colonne | Type | Notes |
|---|---|---|
| `id` | `String` (UUID) | PK |
| `email` | `String` | unique |
| `passwordHash` | `String` | Hash PBKDF2-SHA512, jamais en clair |
| `role` | `Role` | par défaut `PLAYER` |
| `state` | `QueueState` | par défaut `OFFLINE` |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | mise à jour automatique |

**Relations :** 1→1 `PlayerProfile`, `AccountProgression`, `Wallet` ; 1→N tout le reste.

---

### PlayerProfile

Identité d'affichage séparée de l'identité d'authentification.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (unique, suppression en cascade) |
| `pseudo` | String | nom d'affichage |
| `avatarUrl` | String? | |
| `region` | String? | une parmi : EU, NA, LATAM, Asia, OCE |
| `bio` | String? | |
| `preferences` | Json? | réservé pour les paramètres futurs |

---

### RefreshToken

Magasin de révocation des refresh tokens. Seuls les hachages sont stockés, jamais les tokens bruts.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (suppression en cascade) |
| `tokenHash` | String | unique — SHA256 du token brut |
| `revokedAt` | DateTime? | défini lors de la déconnexion ou de la rotation |
| `expiresAt` | DateTime | TTL de 30 jours |

**Index :** `(userId, revokedAt, expiresAt)` — vérification rapide de validité

---

### PlayerMmr

Un enregistrement par paire (utilisateur, mode). La contrainte unique impose un seul MMR par mode.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (suppression en cascade) |
| `mode` | `GameMode` | |
| `mmr` | Int | par défaut `1000` |
| `rankTier` | String | ex. `BRONZE`, `SILVER`, `GOLD`, `PLATINUM`, `DIAMOND` |
| `rankDiv` | String | `I`, `II`, `III` |

**Unique :** `(userId, mode)`

Deltas MMR : `+25` WIN / `-25` LOSS / `+5` DRAW (configurable via `StudioSetting`).

---

### RankConfig

Seuils MMR définis par l'administrateur qui associent des plages à des étiquettes de rang.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `mode` | `GameMode` | |
| `minMmr` | Int | borne inférieure inclusive |
| `maxMmr` | Int? | null = pas de borne supérieure (rang maximal) |
| `rank` | String | ex. `DIAMOND` |
| `sortOrder` | Int | ordre d'affichage |

**Unique :** `(mode, rank)` — **Index :** `(mode, minMmr)`

---

### AccountProgression

Enregistrement unique par utilisateur suivant le XP cumulé et le niveau dérivé.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (unique, suppression en cascade) |
| `level` | Int | par défaut `1` |
| `lifetimeXp` | Int | par défaut `0`, incrémentation en ajout seul |

---

### LevelReward

Catalogue des récompenses accordées à des niveaux spécifiques. Géré par l'administrateur.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `level` | Int | niveau déclencheur |
| `code` | String | code de récompense unique |
| `label` | String | nom d'affichage |
| `rewardType` | `RewardType` | |
| `quantity` | Int? | montant pour les récompenses SOFT_CURRENCY |
| `active` | Boolean | par défaut `true` |
| `sortOrder` | Int | |

**Index :** `(level, active)`

---

### PlayerLevelRewardGrant

Garde d'idempotence — empêche les attributions de récompenses en double.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (suppression en cascade) |
| `level` | Int | niveau au moment de l'attribution |
| `rewardCode` | String | correspond à `LevelReward.code` |
| `label` | String | instantané au moment de l'attribution |
| `rewardType` | `RewardType` | |
| `quantity` | Int? | |
| `grantedAt` | DateTime | |

**Unique :** `(userId, rewardCode)` — empêche le double-octroi  
**Index :** `(userId, grantedAt)`

---

### MatchmakingQueue

Entrées actives en file d'attente. Effacées lorsqu'un match commence ou que le joueur quitte.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (suppression en cascade) |
| `mode` | `GameMode` | |
| `state` | `QueueState` | par défaut `IN_QUEUE` |
| `queuedAt` | DateTime | horodatage d'entrée pour le calcul du temps d'attente |

**Index :** `(mode, state, queuedAt)` — utilisé par le scan de matchmaking

---

### Match

Enregistrement d'en-tête de match. Les participants sont stockés séparément.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `mode` | `GameMode` | |
| `format` | `MatchFormat` | par défaut `ONE_VS_ONE` |
| `startedAt` | DateTime | |
| `finishedAt` | DateTime? | null jusqu'à la soumission du résultat |
| `winnerUserId` | String? | défini pour le 1v1 |
| `winnerTeam` | Int? | défini pour le 3v3 |
| `resultSubmittedById` | String? | identifiant de l'utilisateur soumetteur |
| `resultNotes` | String? | texte libre |

---

### MatchParticipant

Résultat par joueur au sein d'un match. L'instantané MMR est stocké à des fins d'audit.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `matchId` | UUID | FK → Match (suppression en cascade) |
| `userId` | UUID | FK → User (suppression en cascade) |
| `team` | Int? | numéro d'équipe pour le 3v3 |
| `outcome` | `MatchOutcome?` | défini après la soumission du résultat |
| `mmrBefore` | Int? | instantané avant la mise à jour |
| `mmrAfter` | Int? | instantané après la mise à jour |
| `xpAwarded` | Int? | XP crédité à la progression |

**Unique :** `(matchId, userId)`  
**Index :** `(userId, createdAt)` — requêtes d'historique de matchs

---

### Wallet

Un portefeuille par utilisateur. Suit indépendamment la devise douce (gagnée) et la devise forte (achetée).

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (unique, suppression en cascade) |
| `softBalance` | Int | par défaut `0` |
| `hardBalance` | Int | par défaut `0` |

Jamais modifié sans un enregistrement `Transaction` correspondant.

---

### StoreItem

Catalogue de la boutique. Les articles sont désactivés (`active=false`) plutôt que supprimés pour préserver l'historique des transactions.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `itemCode` | String | clé métier unique |
| `name` | String | |
| `description` | String? | |
| `currencyType` | `CurrencyType` | détermine quel canal de portefeuille est débité |
| `price` | Int | unités de la devise concernée |
| `active` | Boolean | par défaut `true` |
| `sortOrder` | Int | ordre d'affichage |

**Index :** `(active, sortOrder)`

---

### Transaction

Registre d'achats en ajout seul. Enregistre chaque tentative de débit quel que soit le résultat.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (suppression en cascade) |
| `storeItemId` | UUID? | FK → StoreItem (mis à null lors de la suppression de l'article) |
| `itemCode` | String? | instantané du code article au moment de l'achat |
| `currencyType` | `CurrencyType` | |
| `unitPrice` | Int | prix unitaire au moment de l'achat |
| `quantity` | Int | |
| `amount` | Int | `unitPrice * quantity` |
| `balanceBefore` | Int | instantané du portefeuille avant le débit |
| `balanceAfter` | Int | instantané du portefeuille après le débit (= balanceBefore si REJECTED) |
| `status` | `TransactionStatus` | `ACCEPTED` ou `REJECTED` |
| `reason` | String? | motif de rejet |
| `metadata` | Json? | données d'audit extensibles |

**Index :** `(userId, createdAt)`, `(status, createdAt)`

---

### InventoryItem

Un enregistrement par article unique possédé par un joueur. La quantité est incrémentée lors d'un achat en double.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (suppression en cascade) |
| `itemCode` | String | |
| `name` | String | |
| `quantity` | Int | par défaut `1` |
| `equipped` | Boolean | par défaut `false` |
| `sourceTransactionId` | String? | lien vers la transaction d'origine |

**Unique :** `(userId, itemCode)`

---

### GameMap

Carte générée par les utilisateurs. Cycle de vie du statut : `DRAFT → BETA → STABLE` (ou `HIDDEN` par modération).

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `creatorId` | UUID | FK → User (suppression en cascade) |
| `title` | String | |
| `description` | String | |
| `tags` | String[] | tags de recherche |
| `status` | `MapStatus` | par défaut `DRAFT` |
| `popularityScore` | Float | dérivé : votes + tests + favoris + récence |
| `reviewStatus` | String | par défaut `pending` |
| `reportCount` | Int | incrémenté à chaque MapReport |
| `lastModerationAt` | DateTime? | |

**Index :** `(status, popularityScore)`, `(creatorId, createdAt)`

---

### MapVersion / MapVote / MapTest / MapFavorite / MapReport

Tables d'interaction UGC secondaires. Toutes effectuent une suppression en cascade lors de la suppression d'une carte ou d'un utilisateur.

| Table | Contrainte clé | Objectif |
|---|---|---|
| `MapVersion` | unique `(mapId, versionLabel)` | Historique des versions |
| `MapVote` | unique `(mapId, userId)` | Un vote par joueur par carte |
| `MapTest` | — | Sessions de test (doublons autorisés) |
| `MapFavorite` | unique `(mapId, userId)` | Un favori par joueur par carte |
| `MapReport` | indexé `(mapId, status)`, `(status, createdAt)` | Signalements des joueurs |

---

### MapModerationEvent

Journal en ajout seul des actions du staff/admin sur une carte.

| Colonne | Type | Notes |
|---|---|---|
| `mapId` | UUID | FK → GameMap |
| `actorId` | UUID | staff/admin ayant effectué l'action |
| `action` | String | ex. `hide`, `approve`, `flag` |
| `reason` | String? | |

---

### Sanction

Actions de modération actives ou historiques sur les joueurs.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (suppression en cascade) |
| `actorId` | UUID? | staff/admin ayant émis la sanction |
| `type` | `SanctionType` | `WARNING`, `SUSPENSION`, `BAN` |
| `reason` | String | |
| `status` | String | par défaut `active` |
| `metadata` | Json? | ex. `{ "acknowledgedAt": "..." }` |
| `startedAt` | DateTime | |
| `endsAt` | DateTime? | null = permanent |

**Index :** `(status, createdAt)`

---

### ModerationSignal

File de révision pour le contenu signalé (signalements de joueurs ou détection automatique).

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `targetType` | String | `player`, `map`, etc. |
| `targetId` | UUID | |
| `reason` | String | |
| `status` | String | par défaut `open` |
| `source` | String | `player_report`, `auto_flag`, etc. |
| `reviewedAt` | DateTime? | |
| `reviewedById` | UUID? | FK → User (mis à null lors de la suppression) |

**Index :** `(status, createdAt)`, `(targetType, targetId)`

---

### ModerationHistory

Journal en ajout seul de toutes les actions de modération effectuées.

| Colonne | Type | Notes |
|---|---|---|
| `actorId` | UUID | staff/admin |
| `targetType` | String | |
| `targetId` | UUID | |
| `action` | String | |
| `reason` | String | |
| `metadata` | Json? | |
| `expiresAt` | DateTime? | pour les suspensions à durée déterminée |
| `acknowledgedAt` | DateTime? | pour l'acquittement des WARNING |

**Index :** `(targetType, targetId, createdAt)`, `(actorId, createdAt)`

---

### AuditLog

Piste d'audit globale pour toutes les opérations sensibles.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `actorId` | UUID | FK → User (suppression en cascade) |
| `action` | String | ex. `auth.login`, `economy.purchase`, `moderation.ban` |
| `targetType` | String | |
| `targetId` | UUID? | |
| `metadata` | Json? | détail spécifique à l'action |

**Index :** `(action, createdAt)`

---

### StudioSetting

Magasin de configuration clé-valeur à l'exécution. Les modifications nécessitent le rôle ADMIN.

| Colonne | Type | Notes |
|---|---|---|
| `key` | String | PK — ex. `mmr_delta_win`, `xp_per_match_win` |
| `value` | Json | valeur typée |
| `updatedById` | UUID? | dernier éditeur |

---

### RuntimeEvent

Journal d'observabilité pour les erreurs, avertissements et événements de trace de l'API.

| Colonne | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `level` | String | `error`, `warn`, `info` |
| `source` | String | nom du module/contrôleur |
| `message` | String | |
| `requestId` | String? | corrèle avec l'en-tête `x-request-id` |
| `metadata` | Json? | trace de pile, contexte de la requête |

**Index :** `(level, createdAt)`, `(source, createdAt)`, `(requestId)`

---

## Flux de Transactions Clés

### Résultat de Match → Économie

```
POST /matches/:id/result
  → MatchParticipant.outcome = WIN/LOSS/DRAW
  → PlayerMmr.mmr += delta
  → PlayerMmr.rankTier updated against RankConfig
  → AccountProgression.lifetimeXp += xpAwarded
  → if new level reached:
      for each LevelReward at new level:
        INSERT PlayerLevelRewardGrant (unique guard)
        if SOFT_CURRENCY: INSERT Transaction + UPDATE Wallet.softBalance
  → AuditLog entry per participant
```

### Achat en Boutique

```
POST /economy/transactions/purchase
  → Validate StoreItem exists + active
  → Validate Wallet.balance >= price * qty
  → INSERT Transaction (status=ACCEPTED, balanceBefore, balanceAfter)
  → UPDATE Wallet (debit)
  → UPSERT InventoryItem (increment quantity on conflict)
  → AuditLog entry
  
  on insufficient balance:
  → INSERT Transaction (status=REJECTED, balanceBefore = balanceAfter)
  → no wallet or inventory mutation
```

### Matchmaking

```
POST /matchmaking/queue/join
  → INSERT MatchmakingQueue (mode, state=IN_QUEUE)
  → User.state = IN_QUEUE (broadcast via Socket.io)

  [background scan: mode, state=IN_QUEUE, mmr within ±400]
  → INSERT Match + MatchParticipant rows
  → DELETE MatchmakingQueue entries
  → User.state = IN_MATCH
  → Socket.io emit queue:matched to both players
```

---

## Migrations

| Migration | Date | Modification |
|---|---|---|
| `20260613174026_init` | 2026-06-13 | Schéma initial complet |
| `20260613203847_add_xp_awarded_to_participant` | 2026-06-13 | Ajout de `xpAwarded` à `MatchParticipant` |
| `20260616155822_add_warn_acknowledged_at` | 2026-06-16 | Ajout de `acknowledgedAt` à `ModerationHistory` |
| `20260616172518_add_match_format_and_teams` | 2026-06-16 | Ajout de l'énumération `MatchFormat`, colonnes `format` + `team` + `winnerTeam` |
