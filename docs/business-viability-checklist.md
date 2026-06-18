# Checklist de viabilité business

## Positionnement produit

GameDash cible les équipes opérant un jeu en ligne compétitif avec des maps créées par la communauté. Le MVP prouve deux propositions de valeur liées :

- Les joueurs obtiennent une boucle de progression visible et des raisons de revenir.
- Les équipes studio obtiennent suffisamment de contrôle et de visibilité pour opérer le jeu en toute sécurité.

## Checklist de valeur MVP

| Domaine | Preuve | Statut |
|---|---|---|
| Onboarding joueur | Inscription, connexion, rafraîchissement, déconnexion, baseline de profil | Couvert |
| Boucle compétitive | File d'attente, attribution de match simulée, résultat de match, historique MMR/rang | Couvert |
| Progression | XP, niveaux, récompenses de niveau, vue de progression | Couvert |
| Économie | Portefeuille, boutique, achat, inventaire, transactions en ajout uniquement | Couvert |
| Maps UGC | Publication, version, vote, test, favori, recherche, statistiques | Couvert |
| Contrôle studio | KPIs, paramètres, signaux/historique/actions de modération | Couvert |
| Sécurité | RBAC, journaux d'audit, identifiants de requête, erreurs standardisées | Couvert |
| Démontabilité | Suite de validation et guide de démo | Couvert |

## Viabilité opérationnelle

- Le studio peut identifier les problèmes de modération via les signaux et l'historique.
- Les actions critiques sont auditables.
- Les paramètres permettent de régler le matchmaking, le MMR et le comportement économique.
- La santé de l'API et les métriques runtime fournissent une première surface de diagnostic.
- Les fallbacks temps réel sont documentés pour les comportements WebSocket dégradés.

## Viabilité des revenus et de l'économie

Le MVP ne traite pas de vrais paiements. Il valide la boucle d'économie interne :

- devises virtuelles
- catalogue d'articles
- débit du portefeuille
- attribution d'inventaire
- journal des transactions acceptées et rejetées
- comportement de paiement simulé documenté comme non-objectif du MVP

La monétisation en production pourra ensuite connecter un vrai processeur de paiement après revue légale, sécurité et conformité.

## Viabilité de l'UGC

La boucle UGC est viable pour du contenu communautaire contrôlé car elle inclut :

- statuts de map
- versions et notes de version
- votes, tests, favoris
- scoring de popularité
- données prêtes pour le signalement et la modération
- actions de modération du staff

La suite en production devrait ajouter le stockage de fichiers, la modération automatisée et les métriques de réputation des créateurs.

## Principaux risques encore ouverts

| Risque | Prérequis de production |
|---|---|
| État runtime en mémoire | Remplacer par des repositories Prisma et des migrations. |
| Pas de vrai fournisseur de paiement | Ajouter l'intégration de paiement uniquement après revue de conformité. |
| Interactivité UI limitée | Construire des écrans authentifiés tenant compte des rôles sur les contrats actuels. |
| Tests de charge limités | Ajouter des tests de charge pour la file d'attente, les maps, les achats et le tableau de bord. |
| Déploiement manuel | Ajouter le CI/CD et la configuration spécifique à l'environnement. |

## Décision Go/No-Go pour la présentation finale

Go quand :

- la suite de validation obligatoire est verte
- la santé de l'API retourne `ok`
- la page web se charge localement
- les docs de livraison finale sont présentes
- le guide de démo est répété

No-Go quand :

- la validation OpenAPI ou Prisma échoue
- build/typecheck/test est rouge
- l'auth de requête ou les limites de rôles sont cassées
- la démo ne peut pas être expliquée à partir des docs et des contrats
