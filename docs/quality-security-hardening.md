# Renforcement de la qualité et de la sécurité

## Référentiel de la phase 7

La phase 7 transforme le MVP en une version démontrable en ajoutant des garde-fous runtime autour des flux critiques déjà livrés dans les phases 1 à 6.

## Gestion des erreurs

- Les échecs HTTP utilisent une seule enveloppe de réponse : `{ error: { code, message, statusCode, timestamp, path, requestId } }`.
- `x-request-id` est accepté des clients lorsqu'il est présent et généré côté serveur dans le cas contraire.
- Les champs de requête inconnus sont rejetés par le pipe de validation global.
- Les échecs RBAC lèvent désormais une erreur explicite `403 Forbidden` au lieu de retourner un échec implicite du guard.

## Observabilité

- Chaque requête HTTP enregistre la méthode, le chemin, le statut, l'id de requête et la durée.
- Les exceptions enregistrent le code, le message, le statut, le chemin, l'id de requête et l'horodatage.
- `GET /api/v1/health` expose le statut runtime, la disponibilité, les vérifications de santé, le nombre de requêtes, le nombre d'erreurs et la latence p95.
- Un modèle Prisma `RuntimeEvent` représente la cible de persistance pour les événements runtime de qualité production.

## Couverture d'intégration

Le test de flux critique de la phase 7 couvre :

- l'inscription joueur et la vérification de token
- la création de match en file classée et la soumission de résultat
- la couverture d'audit MMR et XP
- l'acceptation et le rejet d'achat de portefeuille
- la publication de carte, la gestion de versions, le vote, le test, les favoris, la recherche et la couverture d'audit
- la mise à jour des paramètres du studio et la couverture de l'historique de modération/audit

## Revue des permissions et de la journalisation

- Les périmètres `staff` et `admin` restent appliqués sur les routes studio.
- Les écritures de paramètres restent réservées à l'admin.
- Les flux appartenant aux joueurs continuent de nécessiter un token bearer.
- Les actions critiques conservent la couverture d'audit : authentification, profil, MMR, XP, achats, publication/mise à jour de carte, paramètres et modération.

## Suivi production connu

- Remplacer l'observabilité en mémoire par des écritures durables dans `RuntimeEvent`.
- Ajouter l'export de logs structurés vers la plateforme de déploiement.
- Ajouter de vrais tests d'intégration contre un serveur HTTP en cours d'exécution une fois que la couche de persistance remplace les dépôts en mémoire.
