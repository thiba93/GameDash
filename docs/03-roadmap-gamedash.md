# Roadmap GameDash (A -> Z)

## Vision de livraison
Livrer un MVP jouable et administrable en 9 phases, avec validation continue et dossier final défendable.

## Documents compagnons d'exécution
- Cette roadmap est la source de vérité pour le périmètre et l'ordre des phases.
- Protocole d'exécution pour les prompts `/phaseN` : `docs/phase-protocol.md`
- Portes de validation utilisées pour débloquer les phases suivantes : `docs/phase-gates.md`

## Phase 0 - Cadrage et socle (Semaine 1)
- Clarifier les user stories MVP.
- Fixer l'architecture cible et les conventions.
- Initialiser le repo, la CI, la qualité (lint/tests), les templates de docs.

**Sortie attendue**
- Base projet exécutable.
- Backlog priorisé P0/P1/P2.

## Phase 1 - Identité, Auth, RBAC (Semaines 2-3)
- Inscription/connexion, hash mot de passe, sessions/JWT.
- Rôles `joueur`, `staff`, `admin`.
- Profil joueur (pseudo, avatar, région, bio, préférences).
- Audit des actions sensibles auth/admin.

**Sortie attendue**
- Parcours onboarding complet.
- Endpoints sécurisés et testés.

## Phase 2 - Matchmaking, matchs, MMR/rangs (Semaines 3-5)
- Files multi-modes (classé/non classé/fun).
- États joueur (online/queue/match).
- Attribution de match simulée.
- Elo simplifié + mapping MMR -> rang configurable.
- Historique de matchs et filtres.

**Sortie attendue**
- Cycle de match complet avec mise à jour MMR.
- Visualisations de progression et distribution des rangs.

## Phase 3 - Progression, XP, niveaux (Semaine 5)
- XP post-match.
- Niveau de compte.
- Récompenses de passage de niveau.
- Quêtes optionnelles (si capacité).

**Sortie attendue**
- Boucle de progression visible côté joueur.

## Phase 4 - Économie, boutique, inventaire (Semaines 6-7)
- Monnaie virtuelle et monnaie premium.
- Catalogue boutique.
- Transactions et inventaire.
- Paiement simulé (sandbox/faux service).
- Journal de transactions immuable.

**Sortie attendue**
- Parcours achat complet avec traçabilité.

## Phase 5 - UGC maps communautaires (Semaines 7-9)
- Publication map (metadata, tags, statut).
- Versionnage maps + notes de version.
- Votes/tests/favoris/recherche.
- Score de popularité (votes + tests + récence).
- Stats créateur et map.

**Sortie attendue**
- Portail communautaire exploitable.

## Phase 6 - Backoffice studio (Semaines 9-10)
- Dashboard KPI (actifs, matchs, revenus, activité maps).
- Réglages matchmaking/MMR/économie.
- Modération comptes/maps (ban/suspension/masquage/mise en avant).
- Historique modération + signalements.

**Sortie attendue**
- Pilotage studio end-to-end fonctionnel.

## Phase 7 - Durcissement qualité & sécurité (Semaine 11)
- Tests d'intégration et parcours critiques.
- Gestion des erreurs + observabilité.
- Revue des permissions et journalisation.
- Performance de base et nettoyage technique.

**Sortie attendue**
- Build stable et démontrable.

## Phase 8 - Livraison et soutenance (Semaine 12)
- Documentation technique (API, DB, sécurité).
- Guide utilisateur.
- Script/démo vidéo.
- Checklist de viabilité métier.

**Sortie attendue**
- Dossier final complet + démo live.

## Phase 9 - Finalisation notation et prochaine itération (Semaine 13)
- Analyser le cahier des charges, les attentes de notation et les livrables.
- Produire une matrice de traçabilité exigences -> preuves.
- Identifier les derniers risques pour la note et les réponses jury.
- Formaliser la prochaine itération priorisée.

**Sortie attendue**
- Dossier de revue finale prêt pour le jury.
- Plan de prochaine itération actionnable sans dérive de scope.

## Répartition proposée (alignement cahier des charges)
- Étudiant 1 : Backend Auth + Matchmaking/MMR.
- Étudiant 2 : Frontend Joueur + UX mobile first.


## Jalons de contrôle (Go/No-Go)
- J1 (fin Phase 2) : boucle compétitive fonctionnelle.
- J2 (fin Phase 4) : boucle économique fonctionnelle.
- J3 (fin Phase 6) : boucle studio complète.
- J4 (fin Phase 8) : documentation + démo prêtes.
- J5 (fin Phase 9) : preuves, risques restants et prochaine itération prêts.
