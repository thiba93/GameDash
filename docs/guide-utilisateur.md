# Guide Utilisateur — GameDash

> Ce guide couvre les trois parcours utilisateurs de la plateforme : **Player**, **Staff**, **Admin**.  
> URL frontend : `http://localhost:3000` — API : `http://localhost:3001/api/v1`

---

## Sommaire

1. [Parcours Player](#parcours-player)
2. [Parcours Staff](#parcours-staff)
3. [Parcours Admin](#parcours-admin)
4. [Rôles et permissions](#rôles-et-permissions)
5. [Dépannage commun](#dépannage-commun)

---

## Parcours Player

Le rôle `PLAYER` est attribué automatiquement à l'inscription. C'est le parcours standard de tout joueur sur la plateforme.

---

### 1. Création de compte

**Page :** `/register`

Remplir le formulaire :

| Champ | Requis | Notes |
|---|---|---|
| Email | Oui | Unique sur la plateforme |
| Mot de passe | Oui | Minimum 8 caractères |
| Pseudo | Oui | Nom d'affichage public |

Après soumission :
- Compte créé avec le rôle `PLAYER`
- Session ouverte automatiquement (cookie `gd_session` + access token)
- Redirection vers `/dashboard`

---

### 2. Tableau de bord

**Page :** `/dashboard`

Vue d'ensemble du profil :
- Pseudo, région, niveau actuel
- MMR par mode (Ranked / Unranked / Fun)
- Dernières parties jouées
- Progression XP vers le prochain niveau

---

### 3. Profil et paramètres

**Page :** `/account`

Modifier :
- Pseudo
- Avatar (URL)
- Région (`EU`, `NA`, `LATAM`, `Asia`, `OCE`)
- Bio

Changements sauvegardés via `PATCH /players/me/profile`.

---

### 4. Matchmaking

**Page :** `/matchmaking`

**Rejoindre une file d'attente :**

1. Choisir un mode : `RANKED`, `UNRANKED` ou `FUN`
2. Cliquer sur **Rejoindre la file**
3. Le statut passe à `IN_QUEUE` (visible en temps réel via WebSocket)
4. Quand un adversaire est trouvé (ELO ±400), le statut passe à `IN_MATCH`
5. Les données du match (ID, adversaire) apparaissent à l'écran

**Quitter la file :**
- Cliquer sur **Quitter** avant d'être matché
- Statut revient à `ONLINE`

**Règles de matchmaking :**
- Écart MMR maximum : ±400 (configurable par l'Admin)
- Modes séparés : une file par mode
- Un seul match actif à la fois par joueur

---

### 5. Soumettre un résultat

Après une partie, l'un des participants soumet le résultat via l'interface :

1. Sélectionner le vainqueur (ou DRAW)
2. Confirmer les participants et leurs équipes (3v3)
3. Soumettre

**Ce qui se passe automatiquement :**

```
Résultat soumis
  → MMR mis à jour (+25 victoire / -25 défaite / +5 nul)
  → Rang recalculé (BRONZE I → DIAMOND I)
  → XP attribué
  → Level-up si seuil atteint
  → Récompenses de niveau débloquées (une seule fois par code)
  → Monnaie soft créditée si récompense SOFT_CURRENCY
```

---

### 6. Progression

**Page :** `/progression`

Consulter :
- Niveau actuel et XP cumulée (lifetime)
- Barre de progression vers le prochain niveau
- Historique des récompenses obtenues
- Récompenses à venir par niveau

---

### 7. Économie (Boutique & Portefeuille)

**Page :** `/store`

#### Portefeuille

Deux types de monnaie :

| Type | Source | Usage |
|---|---|---|
| **Soft** (monnaie gagnée) | Victoires, niveaux, récompenses | Achats en boutique SOFT |
| **Hard** (monnaie achetée) | Paiement simulé (Stripe/PayPal) | Achats en boutique HARD |

#### Boutique

1. Parcourir le catalogue d'articles actifs
2. Cliquer sur **Acheter**
3. Confirmer la quantité et le type de monnaie

**Résultat d'un achat accepté :**
- Portefeuille débité
- Article ajouté à l'inventaire (quantité incrémentée si déjà possédé)
- Transaction enregistrée dans l'historique

**Résultat d'un achat rejeté (solde insuffisant) :**
- Portefeuille inchangé
- Transaction rejetée enregistrée quand même (journalisation complète)

#### Inventaire

**Page :** `/store` → onglet Inventaire  
Liste de tous les articles possédés avec quantité et statut équipé.

#### Historique des transactions

Consulter chaque achat : date, article, montant, statut, solde avant/après.

---

### 8. Communauté — Cartes

**Page :** `/community`

#### Créer une carte

1. Titre, description, tags
2. Statut initial : `DRAFT`
3. Publier en `BETA` puis `STABLE` au fur et à mesure des tests

#### Interagir avec les cartes

| Action | Effet |
|---|---|
| Voter (↑ / ↓) | Un vote par joueur par carte |
| Tester | Enregistre une session de test |
| Favoris | Un favori par joueur par carte |
| Signaler | Crée un `ModerationSignal` pour révision Staff |

#### Score de popularité

Calculé automatiquement par le serveur à partir de : votes, tests, favoris, nombre de versions, récence. Non modifiable directement.

---

## Parcours Staff

Le rôle `STAFF` donne accès au back-office de modération. Attribution manuelle par un `ADMIN`.

---

### 1. Accès back-office

**Page :** `/admin`

Accessible uniquement avec les rôles `STAFF` ou `ADMIN`. Redirection vers `/dashboard` si rôle insuffisant.

---

### 2. Tableau de bord

**Page :** `/admin` → Dashboard

KPIs en temps réel :

| Indicateur | Description |
|---|---|
| Joueurs totaux | Nombre de comptes actifs |
| Sessions actives | Joueurs connectés maintenant |
| Parties aujourd'hui | Matchs terminés sur la journée |
| Signalements ouverts | Signaux de modération en attente |
| Revenus simulés | Volume de transactions hard currency |

Graphiques disponibles : activité par heure, répartition par mode, progression des inscriptions.

---

### 3. Signaux de modération

**Page :** `/admin` → Modération → Signaux

Liste des signaux ouverts (`status=open`) :
- Type de cible (`player`, `map`)
- ID de la cible
- Raison signalée
- Source (`player_report`, `auto_flag`)
- Date de création

**Traiter un signal :**

1. Cliquer sur le signal
2. Consulter le contexte (profil joueur ou carte concernée)
3. Appliquer une action ou clore le signal sans action

---

### 4. Actions de modération — Comptes

**Page :** `/admin` → Modération → Joueurs

Trois types de sanctions disponibles :

| Sanction | Effet | Durée |
|---|---|---|
| `WARNING` | Avertissement, le joueur peut accuser réception | Permanente (notification) |
| `SUSPENSION` | Accès temporairement bloqué | `endsAt` défini |
| `BAN` | Accès définitivement bloqué | Permanent (`endsAt = null`) |

**Étapes :**

1. Rechercher le joueur par pseudo ou ID
2. Choisir le type de sanction
3. Rédiger la raison (obligatoire)
4. Définir `endsAt` si SUSPENSION
5. Confirmer

**Ce qui est enregistré automatiquement :**
- `Sanction` record
- `ModerationHistory` entry (append-only)
- `AuditLog` entry (actorId, targetId, action, reason, metadata)

---

### 5. Actions de modération — Cartes

**Page :** `/admin` → Modération → Cartes

Actions disponibles :

| Action | Effet |
|---|---|
| `hide` | Passe la carte en `HIDDEN` — invisible publiquement |
| `approve` | Passe la carte en `STABLE` |
| `flag` | Marque pour révision supplémentaire |

Chaque action crée un `MapModerationEvent` et un `AuditLog`.

---

### 6. Historique de modération

**Page :** `/admin` → Modération → Historique

Journal complet des actions passées. Append-only — aucune modification possible. Filtrable par acteur, cible, type d'action, date.

---

## Parcours Admin

Le rôle `ADMIN` inclut toutes les permissions `STAFF` plus la gestion des paramètres de la plateforme. Il existe un seul compte Admin initial (promotion manuelle en base).

---

### 1. Gestion des paramètres Studio

**Page :** `/admin` → Paramètres

Tous les paramètres sont des paires clé/valeur JSON stockées dans `StudioSetting`. Modifiables uniquement par `ADMIN`.

Paramètres disponibles :

| Clé | Type | Description |
|---|---|---|
| `mmr_delta_win` | Int | Points MMR gagnés par victoire (défaut : 25) |
| `mmr_delta_loss` | Int | Points MMR perdus par défaite (défaut : 25) |
| `mmr_delta_draw` | Int | Points MMR gagnés par nul (défaut : 5) |
| `mmr_queue_delta` | Int | Écart MMR max pour le matchmaking (défaut : 400) |
| `xp_per_match_win` | Int | XP attribuée par victoire |
| `xp_per_match_loss` | Int | XP attribuée par défaite |
| `xp_per_match_draw` | Int | XP attribuée par nul |
| `starter_soft_balance` | Int | Solde soft attribué à l'inscription |

**Modifier un paramètre :**

1. Sélectionner la clé dans la liste
2. Saisir la nouvelle valeur
3. Confirmer

Chaque modification écrit un `AuditLog` (actorId, clé, ancienne valeur, nouvelle valeur).

> Les modifications sont actives immédiatement — pas de rechargement serveur nécessaire.

---

### 2. Analytiques avancées

**Page :** `/admin` → Analytics

Métriques disponibles en plus du dashboard Staff :
- Histogramme des MMR par mode
- Distribution des niveaux joueurs
- Volume de transactions par jour
- Taux de sanctions actives / expirées

---

### 3. Gestion des joueurs

**Page :** `/admin` → Joueurs

Consulter le détail d'un joueur :
- Profil complet
- Soldes wallet
- Historique des sanctions
- Historique des parties
- Inventaire

L'Admin peut déclencher les mêmes actions de modération que le Staff, plus la gestion directe du statut de sanction.

---

### 4. Surveillance en temps réel

Socket.io namespace `/admin` (ADMIN only) :

- Événement `admin:stats` : métriques plateforme pushées en temps réel
- Connexions actives, erreurs runtime, files d'attente actives

---

## Rôles et permissions

| Fonctionnalité | PLAYER | STAFF | ADMIN |
|---|---|---|---|
| Profil & paramètres | ✅ | ✅ | ✅ |
| Matchmaking | ✅ | ✅ | ✅ |
| Boutique & économie | ✅ | ✅ | ✅ |
| Cartes communautaires | ✅ | ✅ | ✅ |
| Dashboard admin | ❌ | ✅ | ✅ |
| Signaux de modération | ❌ | ✅ | ✅ |
| Sanctions joueurs | ❌ | ✅ | ✅ |
| Modération cartes | ❌ | ✅ | ✅ |
| Historique modération | ❌ | ✅ | ✅ |
| Modifier StudioSettings | ❌ | ❌ | ✅ |
| Monitoring temps réel | ❌ | ❌ | ✅ |

---

## Dépannage commun

### Session expirée / 401

Le access token expire après 15 minutes. Le frontend renouvelle automatiquement via le cookie `gd_session`. Si le renouvellement échoue (cookie expiré après 30 jours), se reconnecter sur `/login`.

### Impossible de rejoindre la file — 409

Le joueur est déjà en file ou en match. Quitter la file active (`POST /matchmaking/queue/leave`) avant de rejoindre un nouveau mode.

### Achat rejeté — solde insuffisant

Vérifier les soldes sur `/store` → onglet Portefeuille. Gagner de la monnaie soft via des parties ou attendre une récompense de niveau.

### Page admin inaccessible — 403

Rôle insuffisant. Seuls `STAFF` et `ADMIN` accèdent à `/admin`. Contacter l'administrateur de la plateforme pour une promotion de rôle (opération base de données).

### Tracer une erreur

Chaque réponse d'erreur contient un `requestId`. Utiliser ce champ pour rechercher dans les logs via `GET /health` ou les `RuntimeEvent` en base.

```json
{
  "error": {
    "code": "unauthorized",
    "message": "Bearer token is required.",
    "statusCode": 401,
    "requestId": "req-abc123",
    "path": "/api/v1/players/me/profile"
  }
}
```
