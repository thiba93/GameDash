# Analyse du cahier des charges - GameDash

## 1. Synthese projet
GameDash est une plateforme web unifiee pour un jeu competitif en ligne avec contenu UGC (maps communautaires).
Le systeme doit servir deux usages:
- Experience joueur (compte, progression, matchmaking, economie, maps).
- Pilotage studio (monitoring, equilibrage, moderation, economie, activite maps).

## 2. Objectifs metier
- Rendre la progression joueur visible et comprehensible.
- Donner au studio la maitrise du matchmaking/MMR.
- Structurer l'economie virtuelle avec tracabilite.
- Industrialiser le cycle de vie des maps communautaires (publication -> versionning -> qualite -> mise en avant).

## 3. Portee fonctionnelle MVP
### 3.1 Joueur
- Inscription/connexion, profil, preferences.
- Historique de matchs et etat en file.
- MMR/rangs/niveau/XP.
- Boutique + inventaire + equipement.
- Gestion maps: publier, versionner, suivre votes/tests.

### 3.2 Studio (backoffice)
- KPI globaux: joueurs actifs, matchs, revenus virtuels, activite maps.
- Reglages matchmaking/MMR/rangs/recompenses.
- Economie: prix, rewards, packs.
- Moderation comptes/maps et suivi sanctions.

### 3.3 Technique
- API fiable et securisee.
- Roles/permissions (`joueur`, `staff`, `admin`).
- Journalisation des actions critiques.
- Niveau minimum temps reel (matchmaking/monitoring).

## 4. Exigences non fonctionnelles
- Securite: hash mot de passe, validation input, RBAC strict, audit logs.
- Qualite logicielle: architecture modulaire, testabilite, observabilite.
- UX: dashboard lisible, mobile first cote joueur.
- Exploitabilite: erreurs tracables, indicateurs activite, documentation deploiement.

## 5. Proposition d'architecture cible (MVP realiste)
- Style: modular monolith evolutif vers microservices.
- Frontend: web app role-aware (espace joueur + backoffice).
- Backend: API modulaire par domaine (`auth`, `matchmaking`, `mmr`, `economy`, `maps`, `admin`).
- Donnees: base relationnelle + cache file/temps reel.
- Evenementiel: bus interne pour audit, notifications, recalculs KPI.

## 6. Backlog priorise
### P0 (bloquant demo fonctionnelle)
- Auth + RBAC + gestion profils.
- Matchmaking simule + historique + MMR/rangs.
- XP/niveaux.
- Economie de base: boutique/inventaire/transactions.
- UGC maps: CRUD publication/version/vote/test.
- Dashboard admin minimum + logs critiques.

### P1 (renforcement)
- Parametrage avance matchmaking/MMR.
- Moderation maps avec signalements.
- Classements maps/createurs et score popularite robuste.
- Analytics plus complets (cohortes simples, retention map simplifiee).

### P2 (optionnel)
- Saisons competitives.
- Recompenses saisonnieres createurs.
- Notifications in-app/email.

## 7. Risques principaux et mitigation
- Complexite metier sur MMR/matchmaking:
documenter l'algorithme, tester sur jeux de donnees de simulation.
- Derive de scope:
figer MVP P0 avant toute option saison/notifications.
- Qualite donnees economiques:
imposer idempotence et journal immutable des transactions.
- UGC non modere:
workflow moderation + statut map + journal actions admin.
- Dette technique front/back:
conventions de modules, CI tests/lint, definition of done par lot.

## 8. Criteres d'acceptation MVP
- Parcours joueur complet demonstrable de bout en bout.
- Backoffice operable sur KPI et moderation.
- Logs d'audit consultables pour actions critiques.
- Documentation API/DB/securite et guide utilisateur disponibles.
