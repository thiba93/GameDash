# Guide Utilisateur

## Audience

Ce guide explique le MVP du point de vue des deux groupes d'utilisateurs principaux :

- Joueur.
- Staff studio ou administrateur.

## Parcours joueur

### 1. Créer un compte

Le joueur commence depuis le panneau de création de compte :

- email
- mot de passe
- pseudo
- région
- métadonnées de profil optionnelles

Résultat attendu :

- un compte joueur est créé
- le rôle par défaut est `player`
- des tokens d'accès et de rafraîchissement sont émis
- le profil de base est disponible

### 2. Consulter la session et les routes protégées

Le panneau de session affiche :

- le rôle actuel
- le pseudo du profil
- le comportement de révocation du refresh token

Les routes protégées requièrent un bearer token. Les routes admin requièrent le rôle `staff` ou `admin`.

### 3. Rejoindre le matchmaking

Le joueur peut rejoindre une file pour :

- classé
- non classé
- fun

Le MVP simule l'attribution de parties lorsque deux joueurs rejoignent le même mode de file.

Résultat attendu :

- l'état du joueur passe de `online` à `in_queue`
- une fois la correspondance trouvée, l'état passe à `in_match`
- un identifiant de partie et un identifiant d'adversaire sont disponibles

### 4. Soumettre un résultat et consulter la progression

Après la soumission d'un résultat :

- le MMR est mis à jour.
- le rang est recalculé.
- des XP sont attribués.
- la progression de niveau est mise à jour.
- les récompenses de montée de niveau sont accordées une seule fois.
- des entrées d'audit sont écrites pour les changements de MMR et d'XP.

La surface web affiche :

- le MMR actuel par mode
- l'historique récent des parties
- la carte des rangs
- le niveau du compte et la progression XP
- les récompenses obtenues et à venir

### 5. Utiliser les fonctionnalités économiques

Le joueur peut consulter :

- les soldes du portefeuille
- le catalogue de la boutique
- l'inventaire
- le journal des transactions

Les achats sont simulés en monnaie in-app uniquement. Aucun fournisseur de paiement réel n'est utilisé dans le MVP.

Résultat attendu :

- les achats acceptés débitent le portefeuille et alimentent l'inventaire
- les achats refusés sont tout de même journalisés
- des entrées d'audit économiques sont écrites

### 6. Utiliser les cartes communautaires

Le joueur peut :

- créer une carte
- publier une carte en bêta ou en stable
- créer des versions avec des notes de publication
- voter
- marquer la complétion d'un test
- mettre des cartes en favoris
- rechercher des cartes
- consulter les statistiques de popularité et de créateur

Les cartes masquées sont exclues de la navigation publique par défaut.

## Parcours staff studio

### 1. Consulter les KPIs du tableau de bord

Le staff et les administrateurs peuvent consulter :

- les joueurs actifs
- les parties quotidiennes
- les revenus virtuels
- l'activité des cartes
- les signaux de modération
- les sanctions actives

### 2. Consulter les signaux de modération

Le staff et les administrateurs peuvent inspecter les signaux et rapports de modération.

Résultat attendu :

- les signaux restent traçables
- l'historique de modération est en ajout seul

### 3. Modérer les comptes et les cartes

Le staff et les administrateurs peuvent :

- avertir, suspendre ou bannir des comptes
- masquer, restaurer ou mettre en avant des cartes

Résultat attendu :

- l'action de modération est enregistrée
- une entrée d'audit est écrite avec l'acteur, la cible, l'action, la raison et les métadonnées

## Parcours administrateur

Les administrateurs peuvent mettre à jour les paramètres studio pour :

- le réglage des files de matchmaking
- les deltas MMR
- les soldes de démarrage économiques et les contrôles d'achat

Les écritures de paramètres sont réservées aux administrateurs.

## Support et dépannage

En cas d'échec d'une requête, utiliser :

- le `requestId` de la réponse
- `GET /api/v1/health`
- l'enveloppe d'erreur standard
- `docs/quality-security-hardening.md`
- `docs/performance-baseline.md`
