# Configuration Locale (PostgreSQL + Redis Natifs)

Ce projet utilise intentionnellement des installations locales natives (sans Docker) pour le moment.

## 1. Prérequis
- Node.js >= 20
- pnpm via Corepack (`corepack pnpm`) ou une installation pnpm locale
- PostgreSQL (service local)
- Redis (service local)

## 2. Environnement
Copier les valeurs depuis `.env.example` et ajuster les identifiants si nécessaire.

Minimum requis :
- `DATABASE_URL`
- `REDIS_URL`
- secrets JWT

## 3. Vérifications de santé PostgreSQL
Exemples de commandes :
```bash
psql -h localhost -U postgres -d postgres -c "select version();"
psql -h localhost -U postgres -d gamedash -c "select now();"
```

## 4. Vérifications de santé Redis
Exemple de commande :
```bash
redis-cli ping
```
Résultat attendu : `PONG`

## 5. Installer et valider le projet
```bash
corepack pnpm install
corepack pnpm validate:openapi
corepack pnpm validate:prisma
corepack pnpm lint
corepack pnpm typecheck
```

## 6. Lancer les applications
```bash
corepack pnpm --filter @gamedash/api dev
corepack pnpm --filter @gamedash/web dev
```

Vérification de santé de l'API :
`GET http://localhost:3001/api/v1/health`
