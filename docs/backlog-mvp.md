# Backlog MVP - Tranches verticales

## Tranche 1 - Base auth
Statut : terminé
- API : endpoints inscription/connexion/rafraîchissement/déconnexion.
- Schéma : utilisateur, profil, refresh token.
- Contrats : DTOs de requête/réponse auth.
- Validation : tests smoke de routes auth + vérification des types.

## Tranche 2 - Base matchmaking et MMR
Statut : terminé
- API : rejoindre/quitter la file d'attente/statut.
- API : soumission du résultat de match.
- API : MMR joueur et historique des matchs.
- Schéma : entrée de file d'attente, match, participant, MMR joueur.
- Contrats : DTOs file d'attente/match/MMR.

## Tranche 3 - Base progression
Statut : terminé
- API : progression joueur, règles de progression, récompenses de niveau.
- API : le résultat de match attribue de l'XP et accorde les récompenses de passage de niveau.
- Schéma : progression de compte, récompenses de niveau, attributions de récompenses joueur.
- Contrats : DTOs progression, règles XP, récompenses de niveau.

## Tranche 4 - Base économique
Statut : terminé
- API : articles de boutique, portefeuille, transaction d'achat.
- Schéma : portefeuille, article de boutique, transaction, article d'inventaire.
- Contrats : DTOs portefeuille/boutique/achat.

## Tranche 5 - Base UGC maps
Statut : terminé
- API : créer une map, ajouter une version, voter, tester, lister les maps.
- Schéma : map, version de map, vote, test, favori.
- Contrats : DTOs création de map/version/vote/test.

## Tranche 6 - Base admin et observabilité
Statut : terminé
- API : KPI du dashboard admin, paramètres, signaux de modération et historique de modération.
- Schéma : sanctions, événements de modération, journal d'audit.
- Temps réel : namespaces du catalogue d'événements et docs de fallback.
- Contrats : DTOs résumé admin et modération.

## Tranche 7 - Durcissement qualité et sécurité
Statut : terminé
- API : middleware d'identifiant de requête, enveloppe d'erreur standard, réponse de santé enrichie.
- Schéma : base d'événement runtime pour une observabilité durable future.
- Tests : couverture des flux inter-services critiques et couverture de l'observabilité.
- Docs : notes de durcissement, revue des permissions/journalisation et baseline de performance.

## Tranche 8 - Livraison finale et soutenance
Statut : terminé
- Docs : index de livraison finale, handbook technique, guide utilisateur, guide de démo, runbook de soutenance.
- Docs : checklist de viabilité métier et résumé des suivis de production.
- Validation : suite obligatoire documentée comme porte finale Go/No-Go.
- Démo : séquence en direct et plan de secours documentés.

## Tranche 9 - Revue finale et disponibilité pour la notation
Statut : terminé
- Docs : fiche de revue finale Phase 9 et réponses aux risques de notation.
- Docs : matrice de traçabilité des exigences du cahier des charges vers les preuves du dépôt.
- Docs : plan de prochaine itération avec critères d'acceptation priorisés.
- Livraison : index du package final et flux de soutenance mis à jour.

## Définition du terminé pour chaque tranche
- OpenAPI mis à jour.
- Schéma Prisma mis à jour.
- Package de contrats mis à jour.
- Endpoints API branchés et buildables.
- Lint et vérification des types passants.
- Docs de périmètre et de sécurité mis à jour si le comportement change.
