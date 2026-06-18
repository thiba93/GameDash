# Guide de démo et script vidéo

## Objectif

Montrer que GameDash est un MVP complet avec une boucle joueur, une boucle studio, une baseline de qualité technique et une documentation de livraison finale.

Durée cible : 8 à 12 minutes.

## Préparation

Exécuter la suite de validation avant d'enregistrer ou de présenter :

```bash
corepack pnpm build
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm validate:openapi
corepack pnpm validate:prisma
```

Démarrer les applications :

```bash
corepack pnpm --filter @gamedash/api dev
corepack pnpm --filter @gamedash/web dev
```

Ouvrir :

- Web : `http://localhost:3000`
- Santé API : `http://localhost:3001/api/v1/health`

## Séquence de démo en direct

### 1. Présenter le produit

Script :

> GameDash est une plateforme web pour un jeu en ligne compétitif. Elle couvre l'expérience joueur et le backoffice studio en un seul MVP : compte, matchmaking, progression, économie, maps communautaires, monitoring, paramètres et modération.

Montrer :

- `docs/final-delivery.md`
- `docs/01-analyse-cahier-des-charges.md`
- `docs/03-roadmap-gamedash.md`

### 2. Montrer la santé du dépôt

Script :

> Le projet est validé à travers une suite qualité obligatoire : build, lint, typecheck, tests, validation OpenAPI et validation Prisma.

Montrer :

- la sortie de validation dans le terminal
- `docs/phase-gates.md`
- `docs/quality-security-hardening.md`

### 3. Montrer la surface joueur

Script :

> La boucle joueur commence par l'identité, puis passe au matchmaking, aux résultats de match, au MMR, à l'XP, aux niveaux, à l'économie, à l'inventaire et aux maps UGC.

Montrer dans le web :

- Panneau de création de compte
- Contrat de session
- Routes protégées
- Carte de matchmaking
- Carte MMR
- Matchs récents
- Progression de compte
- Portefeuille/boutique/inventaire
- Maps communautaires et activité UGC

### 4. Montrer la surface studio

Script :

> Le studio peut observer l'activité, régler le matchmaking/MMR/économie et gérer la modération.

Montrer dans le web :

- Tableau de bord studio
- Paramètres studio
- Signaux de modération
- Historique de modération

### 5. Montrer l'API et l'observabilité

Script :

> L'API expose un endpoint de santé avec des vérifications runtime et des métriques de requêtes/erreurs. Les erreurs portent un identifiant de requête pour que les défaillances soient traçables.

Montrer :

- `GET /api/v1/health`
- exemple d'enveloppe d'erreur depuis `docs/technical-handbook.md`
- `docs/security-baseline.md`

### 6. Montrer le modèle de données et les contrats

Script :

> OpenAPI et Prisma définissent les baselines stables de l'API et de la base de données. Le runtime est en mémoire pour la démo MVP, mais la cible de persistance est déjà modélisée.

Montrer :

- `contracts/openapi.yaml`
- `prisma/schema.prisma`
- `packages/contracts/src/http.ts`
- `docs/technical-handbook.md`

### 7. Conclure avec la viabilité et les prochaines étapes

Script :

> Le MVP est démontrable et couvre les principaux risques produit. Les prochaines étapes de production sont le câblage de la persistance, les migrations, l'audit/observabilité durable, le CI et des analytics plus approfondies.

Montrer :

- `docs/business-viability-checklist.md`
- `docs/risk-register.md`
- `docs/performance-baseline.md`

## Checklist d'enregistrement vidéo

- Le zoom du navigateur est lisible.
- La sortie des commandes dans le terminal est visible.
- Aucun secret ou token local n'est affiché.
- Commencer par `docs/final-delivery.md`.
- Terminer sur le résultat de validation et la checklist de viabilité.

## Fallback si le runtime en direct échoue

Si l'application en direct ne peut pas démarrer pendant la soutenance :

1. Montrer les dernières commandes de validation vertes.
2. Montrer le panneau source web dans `apps/web/src/app/page.tsx`.
3. Montrer les contrôleurs API dans `apps/api/src`.
4. Montrer les sorties de validation OpenAPI et Prisma.
5. Continuer avec la séquence de démo pilotée par la documentation.
