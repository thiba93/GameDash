# Portes de phase

## Objectif

Définir des portes de réussite/échec objectives pour chaque phase de la feuille de route.

Une phase est considérée comme complète uniquement lorsque :

- la portée de la feuille de route pour cette phase est implémentée
- les portes ci-dessous passent sur la branche courante
- la suite de validation obligatoire est verte

Ce fichier dérive les portes d'implémentation de `docs/03-roadmap-gamedash.md`. La feuille de route reste la source de vérité pour la portée et l'ordre.

## Règles inter-phases

Chaque phase qui modifie un comportement doit également mettre à jour les éléments concernés :

- implémentation de l'API
- modèle de données et migrations
- contrats partagés
- contrat OpenAPI
- tests
- documentation technique
- documentation de fallback ou temps réel si applicable

Chaque phase doit préserver :

- l'API REST sous `/api/v1`
- les limites de rôles `player`, `staff`, `admin`
- la journalisation d'audit pour les actions critiques
- les règles de la baseline de sécurité

## Porte de la phase 0 - Cadrage et socle

Réussit quand tous les éléments suivants sont vrais :

- la structure monorepo existe et est cohérente
- `apps/api` et `apps/web` sont présents et compilables
- `contracts/openapi.yaml` existe et est maintenu
- `prisma/schema.prisma` existe et est maintenu
- le package de contrats partagés existe et est consommé par l'API et le web
- les docs de base existent pour la portée, le backlog, la sécurité, les décisions, les risques, le fallback temps réel et la configuration locale
- les scripts du dépôt existent pour `build`, `lint`, `typecheck`, `test`, `validate:openapi` et `validate:prisma`

## Porte de la phase 1 - Identité, Auth, RBAC

Réussit quand tous les éléments suivants sont vrais :

- l'inscription, la connexion, le rafraîchissement et la déconnexion sont implémentés sous `/api/v1/auth`
- les mots de passe sont hachés et ne sont jamais stockés ni renvoyés en clair
- le flux de jetons d'accès et de rafraîchissement est implémenté
- les jetons de rafraîchissement sont révocables côté serveur
- les rôles `player`, `staff` et `admin` sont appliqués dans le code
- la baseline du profil joueur existe avec pseudo, avatar, région et bio au minimum
- les actions d'authentification et d'administration sensibles écrivent des journaux d'audit
- les endpoints sont sécurisés et testés

## Porte de la phase 2 - Matchmaking, matchs, MMR, rangs

Réussit quand tous les éléments suivants sont vrais :

- les files d'attente multi-modes existent pour classé, non classé et fun
- les transitions d'état du joueur sont représentées entre en ligne, en file d'attente et en match
- l'attribution de match simulée existe
- la soumission des résultats de match persiste un résultat de match
- la logique de mise à jour du MMR existe et est appliquée après les résultats de match
- la correspondance MMR vers rang est configurable
- l'historique des matchs peut être consulté avec des payloads stables
- les vues de progression orientées joueur pour le MMR et les rangs existent dans l'UI
- les mises à jour du MMR écrivent des journaux d'audit

## Porte de la phase 3 - Progression, XP, niveaux

Réussit quand tous les éléments suivants sont vrais :

- l'XP est attribuée après la fin d'un match
- le niveau de compte est persisté et exposé
- la progression de niveau est visible sur la surface joueur
- les récompenses de montée de niveau sont modélisées et accordées
- les règles de progression sont couvertes par des tests
- si des quêtes sont implémentées, elles restent optionnelles et documentées comme optionnelles

## Porte de la phase 4 - Économie, boutique, inventaire

Réussit quand tous les éléments suivants sont vrais :

- les devises soft et hard sont modélisées explicitement
- le catalogue de la boutique est persisté et interrogeable
- les soldes du portefeuille sont persistés et interrogeables
- le flux d'achat met à jour le portefeuille, l'inventaire et l'historique des transactions de manière cohérente
- le journal des transactions est immuable ou en ajout uniquement par conception
- le comportement de paiement simulé est documenté lorsqu'il est utilisé
- les actions d'économie écrivent des journaux d'audit
- l'intégrité des transactions est couverte par des tests

## Porte de la phase 5 - Maps communautaires UGC

Réussit quand tous les éléments suivants sont vrais :

- le flux de création de map existe avec métadonnées, tags et statut
- le versionnage de map existe avec des notes de version
- les votes, les tests, les favoris et la recherche sont implémentés
- le score de popularité utilise les votes, les tests et la récence avec des règles documentées
- les statistiques du créateur et de la map sont disponibles
- les actions de publication et de mise à jour de map écrivent des journaux d'audit
- les données pertinentes pour la modération existent pour une utilisation ultérieure dans le backoffice

## Porte de la phase 6 - Backoffice studio

Réussit quand tous les éléments suivants sont vrais :

- le tableau de bord admin expose les KPI principaux de la baseline du projet
- les paramètres existent pour le réglage du matchmaking, du MMR et de l'économie
- les actions de modération existent pour les comptes et les maps
- l'historique de modération et les signalements ou signaux sont représentés
- les permissions admin et staff sont appliquées
- les actions de modération et de paramètres écrivent des journaux d'audit
- les workflows du studio sont utilisables de bout en bout

## Porte de la phase 7 - Durcissement qualité et sécurité

Réussit quand tous les éléments suivants sont vrais :

- une couverture d'intégration existe pour les flux utilisateur et admin critiques
- la gestion des erreurs est cohérente et documentée
- l'observabilité est suffisante pour diagnostiquer les défaillances critiques
- les règles de permissions et de journalisation sont révisées et appliquées
- les goulots d'étranglement de performance de base ont été traités ou documentés
- le dépôt est stable sous la suite de validation obligatoire

## Porte de la phase 8 - Livraison et soutenance

Réussit quand tous les éléments suivants sont vrais :

- la documentation technique existe pour l'API, la base de données, la sécurité et la configuration
- un guide utilisateur initial existe
- un script de démo ou un guide de démo existe
- la checklist de viabilité business existe
- le dépôt est dans un état démontrable avec la suite de validation verte

## Porte de la phase 9 - Finition notation et prochaine itération

Réussit quand tous les éléments suivants sont vrais :

- le matériel de revue finale met en correspondance les attentes du cahier des charges avec les preuves du dépôt
- une matrice de traçabilité des exigences existe
- les risques résiduels de notation sont explicites et associés à des réponses de soutenance
- la prochaine itération d'implémentation est priorisée avec des critères d'acceptation
- `docs/final-delivery.md` référence le package de preuves de la phase 9
- le dépôt reste dans un état démontrable avec la suite de validation verte
