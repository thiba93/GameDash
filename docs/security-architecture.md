# Architecture de Sécurité — GameDash

---

## Flux d'Authentification

### Inscription

1. Le client envoie `{ email, password, pseudo }` à `POST /auth/register`
2. L'API valide le payload via `ValidationPipe` de NestJS (whitelist + forbidNonWhitelisted)
3. Le mot de passe est haché avec **PBKDF2-SHA512** — jamais stocké en clair
4. L'enregistrement `User` est créé avec `role=PLAYER`, `state=OFFLINE`
5. `PlayerProfile` est créé avec le pseudo fourni
6. Une paire access token + refresh token est retournée (voir Modèle de Token ci-dessous)

### Connexion

1. Recherche par e-mail → comparaison du mot de passe via **`crypto.timingSafeEqual`** (prévient les attaques temporelles)
2. Les identifiants incorrects retournent un `401` générique — aucune distinction entre « utilisateur introuvable » et « mot de passe incorrect »
3. La paire de tokens est émise en cas de succès

### Modèle de Token

| Token | Algorithme | TTL | Stockage |
|---|---|---|---|
| Access token | JWT HMAC-SHA256 | 15 minutes | Mémoire client / en-tête Authorization |
| Refresh token | JWT HMAC-SHA256 | 30 jours | Cookie `gd_session` (HttpOnly) |

La valeur du refresh token n'est **jamais stockée brute** — seul `SHA256(token)` est écrit dans `RefreshToken.tokenHash`.

### Rotation des Tokens

Sur `POST /auth/refresh` :
1. Valider la signature et l'expiration du refresh token entrant
2. Rechercher `RefreshToken` par `tokenHash` — vérifier qu'il n'est pas révoqué (`revokedAt IS NULL`) et non expiré
3. Marquer l'ancien token comme révoqué (`revokedAt = now()`)
4. Émettre un nouvel access token + un nouveau refresh token
5. Le TTL de l'ancien access token (15 min) est la fenêtre d'exposition maximale après déconnexion

### Déconnexion

`POST /auth/logout` définit `RefreshToken.revokedAt = now()`. Les futures tentatives de rafraîchissement avec ce token sont rejetées à l'étape 2 ci-dessus.

---

## Autorisation

### Guards

Deux guards NestJS appliqués au niveau du contrôleur :

| Guard | Ce qu'il vérifie |
|---|---|
| `AuthGuard` | Valide la signature JWT et l'expiration dans l'en-tête `Authorization: Bearer`. Retourne `401` en cas d'échec. |
| `RolesGuard` | Vérifie `User.role` par rapport au décorateur `@Roles()` sur la route. Retourne `403` en cas de non-correspondance. |

Les routes sans `@Roles()` sont accessibles à tout utilisateur authentifié.

### Hiérarchie des Rôles

```
PLAYER  — par défaut à l'inscription
  ↓
STAFF   — peut lire le tableau de bord admin, les signaux/historiques de modération, appliquer des sanctions
  ↓
ADMIN   — toutes les permissions STAFF + mise à jour des StudioSettings, gestion des rôles
```

La promotion de rôle nécessite une mutation directe en base de données (pas d'endpoint en libre-service).

### Routes Publiques (sans AuthGuard)

```
POST /auth/register
POST /auth/login
POST /auth/refresh
GET  /health
```

Toutes les autres routes nécessitent un Bearer token valide.

---

## Validation des Entrées

`ValidationPipe` de NestJS configuré globalement au démarrage :

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // strip unknown fields
  forbidNonWhitelisted: true // reject requests with extra fields
}));
```

Tous les DTOs de requête utilisent des décorateurs `class-validator`. Le pipeline s'exécute avant tout gestionnaire de contrôleur — les payloads malformés n'atteignent jamais la logique métier.

---

## CORS

Configuré dans `apps/api/src/main.ts` :

```typescript
app.enableCors({
  origin: process.env.WEB_ORIGIN,   // default: http://localhost:3000
  credentials: true
});
```

`WEB_ORIGIN` est la seule origine autorisée. L'indicateur credentials active la transmission des cookies pour le flux du refresh token.

---

## Cookie de Session

Le frontend (`apps/web`) stocke le refresh token dans `gd_session` — un cookie HttpOnly. L'access token est conservé en mémoire (pas dans le localStorage) pour atténuer l'exfiltration XSS.

Middleware frontend (`apps/web/src/middleware.ts`) :
- Valide la présence de `gd_session` sur les routes protégées
- Liste blanche des chemins publics : `/login`, `/register`, `/api/*`
- Redirige les requêtes non authentifiées vers `/login`

---

## Sécurité des Mots de Passe

| Propriété | Implémentation |
|---|---|
| Algorithme | PBKDF2-SHA512 |
| Comparaison | `crypto.timingSafeEqual` — temps constant |
| Stockage | Hash uniquement, colonne `passwordHash` |
| Texte en clair | Jamais journalisé, jamais retourné dans les réponses API |

---

## Piste d'Audit

Toutes les opérations sensibles écrivent dans `AuditLog`. Événements requis :

| Domaine | Actions journalisées |
|---|---|
| Auth | `auth.register`, `auth.login`, `auth.refresh`, `auth.logout` |
| Joueur | `player.profile_update` |
| Match | `match.result_submit` — une entrée par participant, inclut matchId, mode, delta MMR, changement de rang |
| Progression | `progression.xp_award` — inclut matchId, xpAwarded, niveau avant/après, codes de récompense accordés |
| Économie | `economy.purchase` — inclut itemCode, devise, montant, solde avant/après, motif de rejet |
| Cartes | `map.publish`, `map.update` — inclut versionId, versionLabel |
| Modération | `moderation.action` — inclut actorId, targetId, type, raison, endsAt |
| Admin | `admin.settings_update` — inclut la clé, l'ancienne valeur, la nouvelle valeur |

Les enregistrements d'audit sont en ajout seul — aucune opération de mise à jour ou de suppression sur `AuditLog`.

---

## Modération & Sanctions

### Sanctions des Joueurs

| Type | Comportement |
|---|---|
| `WARNING` | Enregistré, le joueur peut acquitter (`acknowledgedAt`) |
| `SUSPENSION` | Durée limitée (`endsAt` défini). Appliqué à l'authentification et à l'entrée en match. |
| `BAN` | Permanent (`endsAt = null`). |

Les sanctions sont appliquées par STAFF ou ADMIN via `POST /admin/moderation/actions`. Chaque action écrit :
1. Un enregistrement `Sanction`
2. Une entrée `ModerationHistory` (en ajout seul)
3. Une entrée `AuditLog`

### Modération UGC

Les cartes suivent un cycle de révision : `DRAFT → BETA → STABLE`. Le staff peut définir le statut à `HIDDEN`.

Les cartes `HIDDEN` sont exclues de tous les endpoints de liste, sauf si l'appelant a le rôle STAFF/ADMIN et filtre explicitement `status=hidden`.

Le score de popularité est calculé côté serveur à partir des votes + tests + favoris + nombre de versions + récence. Les utilisateurs ne peuvent pas définir directement le score.

---

## Secrets & Environnement

Tous les secrets sont chargés depuis des variables d'environnement — jamais codés en dur.

| Variable | Objectif |
|---|---|
| `JWT_ACCESS_SECRET` | Clé HMAC pour les access tokens |
| `JWT_REFRESH_SECRET` | Clé HMAC pour les refresh tokens |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL |
| `REDIS_URL` | Magasin de session/cache (réservé) |

Les longueurs minimales des secrets et leur rotation sont des préoccupations de déploiement en production non imposées par le code lui-même.

---

## Contraintes MVP Connues

| Contrainte | Notes |
|---|---|
| Simulation de paiement | Les flux Stripe/PayPal sont simulés — aucune vraie référence de paiement utilisée |
| Dépôts en mémoire | Le MVP utilise des magasins en mémoire dans certains modules ; le schéma Prisma est la cible de production prévue |
| Limitation de débit | Non implémentée — à ajouter avant le déploiement public |
| HTTPS | Non imposé par l'API elle-même — la terminaison TLS est attendue au niveau du reverse proxy |
| Rotation du refresh token | Implémentée mais sans fenêtre glissante — TTL fixe de 30 jours sur chaque token émis |
