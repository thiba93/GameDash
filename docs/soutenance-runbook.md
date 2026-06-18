# Runbook de soutenance

## Objectif

Fournir une checklist opérationnelle courte pour la soutenance finale.

## Avant la session

1. Récupérer le dernier `main`.
2. Installer les dépendances si nécessaire :

```bash
corepack pnpm install
```

3. Exécuter la suite de validation complète :

```bash
corepack pnpm build
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm validate:openapi
corepack pnpm validate:prisma
```

4. Ouvrir les documents clés :

- `docs/final-delivery.md`
- `docs/demo-guide.md`
- `docs/technical-handbook.md`
- `docs/business-viability-checklist.md`
- `docs/phase-9-final-review.md`
- `docs/requirements-traceability-matrix.md`

## Démarrer la démo

Terminal 1 :

```bash
corepack pnpm --filter @gamedash/api dev
```

Terminal 2 :

```bash
corepack pnpm --filter @gamedash/web dev
```

Navigateur :

```text
http://localhost:3000
```

Santé :

```text
http://localhost:3001/api/v1/health
```

## Points de discours

- Produit : une plateforme unique pour le cycle de vie du joueur et les opérations du studio.
- Architecture : Next.js, NestJS, contrats partagés, OpenAPI, Prisma.
- Sécurité : RBAC, mots de passe hachés, rotation des jetons de rafraîchissement, journaux d'audit, erreurs standardisées.
- Qualité : suite de validation obligatoire, tests de flux critiques, observabilité.
- Business : progression, économie, UGC, modération, contrôles opérationnels.
- Traçabilité : chaque attente du cahier des charges a une preuve dans le dépôt et un chemin de validation.

## Questions attendues et réponses courtes

### Le projet est-il prêt pour la production ?

Non. C'est un MVP démontrable. La principale étape de production est de remplacer les repositories en mémoire par une persistance adossée à Prisma et d'ajouter le CI/CD.

### Pourquoi simuler les paiements ?

Les paiements réels nécessitent une conformité et une intégration avec un fournisseur. Le MVP valide le débit du portefeuille, l'attribution d'inventaire, le journal des transactions et le comportement de rejet sans manipuler de vrai argent.

### Comment la modération est-elle gérée ?

Le MVP inclut des signaux de modération, des actions sur les comptes et les maps, un historique de modération en ajout uniquement et des entrées d'audit. La production ajouterait une détection automatisée et des files d'attente de réviseurs.

### Comment les contrats API sont-ils contrôlés ?

OpenAPI et les DTOs TypeScript partagés sont maintenus ensemble. `validate:openapi`, `typecheck` et les tests de service sont des portes obligatoires.

### Comment diagnostiquer les défaillances ?

Utiliser `x-request-id`, l'enveloppe d'erreur standard, `GET /api/v1/health`, les métriques runtime, les journaux d'audit et la baseline de performance documentée.

### Qu'est-ce qui reste après le MVP ?

Le câblage de la persistance, le CI/CD, les tests E2E navigateur, l'UI connectée tenant compte des rôles, l'observabilité durable et la préparation au déploiement. Ces éléments sont priorisés dans `docs/next-iteration-plan.md`.

## Fallback d'urgence

Si le runtime local échoue :

1. Montrer la sortie de la suite de validation.
2. Montrer `contracts/openapi.yaml`.
3. Montrer `prisma/schema.prisma`.
4. Montrer `apps/api/src/quality/critical-flows.spec.ts`.
5. Continuer avec `docs/demo-guide.md`.
6. Utiliser `docs/requirements-traceability-matrix.md` pour garder la soutenance axée sur les preuves.
