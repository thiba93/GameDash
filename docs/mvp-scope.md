# Périmètre MVP - GameDash

## Dans le périmètre

### Authentification et identité
- Inscription, connexion, rafraîchissement, déconnexion.
- Modèle de rôles : `player`, `staff`, `admin`.
- Profil joueur de base (pseudo, avatar, région, bio).

### Boucle compétitive
- Rejoindre/quitter la file d'attente/statut par mode.
- Soumission du résultat de match.
- Endpoint de lecture du MMR joueur.
- Endpoint d'historique des matchs joueur.

### Boucle de progression
- XP attribuée après la fin d'un match.
- Endpoint de lecture du niveau de compte.
- Configuration des récompenses de niveau et récompenses accordées.

### Boucle économique
- Liste des articles de la boutique.
- Lecture du portefeuille.
- Transaction d'achat de base.
- Inventaire de base dans le modèle de données.
- Journal de transactions et flux simulé de débit de portefeuille.

### Boucle UGC maps
- Créer une map.
- Créer une version de map.
- Voter pour une map.
- Marquer un test de map.
- Parcourir les maps.
- Mettre en favoris des maps, rechercher des maps, et lire les stats créateur/map.

### Base studio/admin
- Endpoint du dashboard admin avec KPI de base.
- Sanctions/modération admin représentées dans le schéma et les contrats.
- Base du journal d'audit représentée dans le schéma et les docs.
- Paramètres studio pour le réglage du matchmaking, du MMR et de l'économie.
- Actions de modération pour les comptes et les maps avec signaux et historique.

### Durcissement qualité et sécurité
- Les flux critiques joueur et studio sont couverts par un test de type intégration.
- Les erreurs API utilisent une enveloppe de réponse standard avec des identifiants de requête.
- La sortie de santé expose les vérifications d'exécution, les compteurs de requêtes/erreurs, le temps de fonctionnement et la durée p95.
- L'observabilité d'exécution dispose d'une cible de persistance Prisma via `RuntimeEvent`.

### Livraison finale et soutenance
- La documentation technique couvre l'API, la base de données, la sécurité, l'installation et le suivi en production.
- Le guide utilisateur explique les parcours joueur, staff et admin.
- Le guide de démo et le runbook de soutenance définissent le chemin de présentation en direct.
- La checklist de viabilité métier couvre la valeur produit, les risques et les critères Go/No-Go.

## Non-objectifs explicites (fondation phase 0)
- Intégration gameplay complète.
- Traitement de paiement réel.
- Interface UI de workflow de modération complet.
- Systèmes de saisons et notifications.
- Analytics avancés et logique anti-triche poussée.

## Critères d'acceptation MVP par module

### Auth
- Toutes les routes auth existent sous `/api/v1/auth`.
- Le contrat JWT est explicite dans OpenAPI.
- Les règles de base de sécurité sont documentées.
- Les routes de profil joueur existent sous `/api/v1/players/me/profile`.
- L'application des rôles staff/admin est représentée sur les routes admin protégées.

### Matchmaking/MMR
- Les routes de file d'attente existent et retournent des contrats de payload stables.
- La route de résultat de match existe avec un payload de requête typé.
- Les routes MMR joueur et historique des matchs existent.
- La base de la Phase 2 inclut l'attribution simulée de match, les mises à jour MMR en temps d'exécution, le mapping de rang et les entrées d'audit MMR.

### Progression
- La soumission du résultat de match attribue de l'XP à chaque participant.
- L'endpoint de progression joueur expose le niveau, l'XP totale, l'XP du niveau actuel, l'objectif du prochain niveau et les récompenses accordées.
- La configuration des récompenses de niveau est explicite dans les contrats partagés et les réponses API.
- La base de la Phase 3 n'implémente pas les quêtes ; les quêtes restent dans le périmètre optionnel futur.

### Économie
- Les contrats de routes boutique, portefeuille et achat existent.
- Les énumérations de devises et transactions sont définies dans Prisma.
- La base de la Phase 4 inclut les soldes en monnaie virtuelle et premium, le catalogue boutique interrogeable, le flux d'achat adossé au portefeuille, les attributions d'inventaire, le journal de transactions et les entrées d'audit d'achat.
- Le comportement de paiement est simulé : les achats débitent uniquement le portefeuille in-app ; aucun processeur externe n'est appelé dans la base MVP.

### Maps/UGC
- Toutes les routes de base maps existent avec des contrats de payload typés.
- Les entités de versionnage et de vote/test existent dans le schéma Prisma.
- La base de la Phase 5 inclut les métadonnées de création de map, les notes de version, les votes, les tests, les favoris, les filtres de recherche, les stats créateur/map, le score de popularité et les entrées d'audit de publication/mise à jour de map.
- Les données pertinentes pour la modération existent via le statut de la map, les métadonnées de révision, les signalements et les événements de modération pour les workflows backoffice ultérieurs.

### Backoffice/admin
- La route de base admin existe.
- Les entités de modération/sanction existent dans le schéma Prisma.
- La base de la Phase 6 inclut les KPI studio, la lecture/mise à jour des paramètres, les actions de modération compte/map, les signaux/historique de modération, la protection des routes staff/admin et les entrées d'audit pour les actions de paramétrage/modération.

### Qualité/sécurité
- La base de la Phase 7 inclut des réponses d'erreur cohérentes, la propagation des identifiants de requête, les métriques de santé d'exécution, les réponses d'accès refusé explicites et la couverture d'intégration critique.
- Les goulots d'étranglement de performance de base et les suivis de production sont documentés.

### Livraison/soutenance
- La base de la Phase 8 inclut `docs/final-delivery.md`, `docs/technical-handbook.md`, `docs/user-guide.md`, `docs/demo-guide.md`, `docs/soutenance-runbook.md` et `docs/business-viability-checklist.md`.
- La Phase 9 ajoute les preuves de revue finale via `docs/phase-9-final-review.md`, `docs/requirements-traceability-matrix.md` et `docs/next-iteration-plan.md`.
- La disponibilité de la démo finale dépend du passage complet de la suite de validation obligatoire.

### Transversal
- OpenAPI passe le lint.
- Le schéma Prisma passe `prisma validate`.
- Le package de contrats partagés exporte les DTOs de base.
