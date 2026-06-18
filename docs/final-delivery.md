# Livraison finale GameDash

## Objectif

Ce document est le point d'entrée du package de livraison finale. Il référence le matériel technique, utilisateur, de démo, business et de préparation à la notation requis pour la revue finale.

## État de la livraison

- Phase de la feuille de route : Phase 9 - Finition notation et prochaine itération.
- État du MVP : baseline démontrable de bout en bout.
- Porte de validation : build, lint, typecheck, tests, validation OpenAPI et validation Prisma doivent être verts avant la démo.
- Portée runtime : services MVP en mémoire adossés à des contrats Prisma/OpenAPI pour la cible de persistance en production.

## Package final

| Besoin | Document |
|---|---|
| Produit et portée | `docs/mvp-scope.md` |
| Feuille de route et portes de phase | `docs/03-roadmap-gamedash.md`, `docs/phase-gates.md` |
| API technique, BDD, sécurité, configuration | `docs/technical-handbook.md` |
| Configuration locale | `docs/local-setup-native.md` |
| Sécurité et durcissement | `docs/security-baseline.md`, `docs/quality-security-hardening.md` |
| Temps réel et fallback | `docs/event-catalog.md` |
| Guide utilisateur | `docs/user-guide.md` |
| Guide de démo et script vidéo | `docs/demo-guide.md` |
| Runbook de soutenance | `docs/soutenance-runbook.md` |
| Viabilité business | `docs/business-viability-checklist.md` |
| Revue finale et préparation à la notation | `docs/phase-9-final-review.md` |
| Traçabilité des exigences | `docs/requirements-traceability-matrix.md` |
| Prochaine itération d'implémentation | `docs/next-iteration-plan.md` |
| Risques et décisions | `docs/risk-register.md`, `docs/decision-log.md` |

## Checklist de préparation à la démo

- `corepack pnpm install` a été exécuté.
- `corepack pnpm build` passe.
- `corepack pnpm lint` passe.
- `corepack pnpm typecheck` passe.
- `corepack pnpm test` passe.
- `corepack pnpm validate:openapi` passe.
- `corepack pnpm validate:prisma` passe.
- L'API peut démarrer avec `corepack pnpm --filter @gamedash/api dev`.
- Le web peut démarrer avec `corepack pnpm --filter @gamedash/web dev`.
- `GET http://localhost:3001/api/v1/health` retourne le statut `ok`.
- La démo web se charge sur `http://localhost:3000`.

## Parcours de revue recommandé

1. Ouvrir ce fichier pour montrer la structure de la livraison.
2. Exécuter la suite de validation pour prouver la santé du dépôt.
3. Ouvrir l'application web et parcourir les surfaces joueur et studio visibles.
4. Utiliser `docs/demo-guide.md` pour la séquence de démo en direct.
5. Utiliser `docs/technical-handbook.md` pour les questions sur l'API, la base de données, la sécurité et la configuration.
6. Utiliser `docs/requirements-traceability-matrix.md` pour répondre aux questions de couverture du cahier des charges.
7. Conclure avec `docs/business-viability-checklist.md` et `docs/next-iteration-plan.md` pour montrer la viabilité du produit et les prochaines étapes.
