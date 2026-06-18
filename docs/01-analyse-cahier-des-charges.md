# Analyse du cahier des charges - GameDash

## 1. Synthèse projet
GameDash est une plateforme web unifiée pour un jeu compétitif en ligne avec contenu UGC (maps communautaires).
Le système doit servir deux usages :
- Expérience joueur (compte, progression, matchmaking, économie, maps).
- Pilotage studio (monitoring, équilibrage, modération, économie, activité maps).

## 2. Objectifs métier
- Rendre la progression joueur visible et compréhensible.
- Donner au studio la maîtrise du matchmaking/MMR.
- Structurer l'économie virtuelle avec traçabilité.
- Industrialiser le cycle de vie des maps communautaires (publication -> versionnage -> qualité -> mise en avant).

## 3. Portée fonctionnelle MVP
### 3.1 Joueur
- Inscription/connexion, profil, préférences.
- Historique de matchs et état en file.
- MMR/rangs/niveau/XP.
- Boutique + inventaire + équipement.
- Gestion maps : publier, versionner, suivre votes/tests.

### 3.2 Studio (backoffice)
- KPI globaux : joueurs actifs, matchs, revenus virtuels, activité maps.
- Réglages matchmaking/MMR/rangs/récompenses.
- Économie : prix, rewards, packs.
- Modération comptes/maps et suivi sanctions.

### 3.3 Technique
- API fiable et sécurisée.
- Rôles/permissions (`joueur`, `staff`, `admin`).
- Journalisation des actions critiques.
- Niveau minimum temps réel (matchmaking/monitoring).

## 4. Exigences non fonctionnelles
- Sécurité : hash mot de passe, validation input, RBAC strict, audit logs.
- Qualité logicielle : architecture modulaire, testabilité, observabilité.
- UX : dashboard lisible, mobile first côté joueur.
- Exploitabilité : erreurs traçables, indicateurs activité, documentation déploiement.

## 5. Proposition d'architecture cible (MVP réaliste)
- Style : monolithe modulaire évolutif vers microservices.
- Frontend : web app role-aware (espace joueur + backoffice).
- Backend : API modulaire par domaine (`auth`, `matchmaking`, `mmr`, `economy`, `maps`, `admin`).
- Données : base relationnelle + cache file/temps réel.
- Événementiel : bus interne pour audit, notifications, recalculs KPI.

## 6. Backlog priorisé
### P0 (bloquant démo fonctionnelle)
- Auth + RBAC + gestion profils.
- Matchmaking simulé + historique + MMR/rangs.
- XP/niveaux.
- Économie de base : boutique/inventaire/transactions.
- UGC maps : CRUD publication/version/vote/test.
- Dashboard admin minimum + logs critiques.

### P1 (renforcement)
- Paramétrage avancé matchmaking/MMR.
- Modération maps avec signalements.
- Classements maps/créateurs et score popularité robuste.
- Analytics plus complets (cohortes simples, rétention map simplifiée).

### P2 (optionnel)
- Saisons compétitives.
- Récompenses saisonnières créateurs.
- Notifications in-app/email.

## 7. Risques principaux et mitigation
- Complexité métier sur MMR/matchmaking :
documenter l'algorithme, tester sur jeux de données de simulation.
- Dérive de scope :
figer MVP P0 avant toute option saison/notifications.
- Qualité données économiques :
imposer idempotence et journal immutable des transactions.
- UGC non modéré :
workflow modération + statut map + journal actions admin.
- Dette technique front/back :
conventions de modules, CI tests/lint, definition of done par lot.

## 8. Critères d'acceptation MVP
- Parcours joueur complet démontrable de bout en bout.
- Backoffice opérable sur KPI et modération.
- Logs d'audit consultables pour actions critiques.
- Documentation API/DB/sécurité et guide utilisateur disponibles.
