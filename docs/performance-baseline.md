# Référentiel de performance

## Référentiel de la phase 7

Le MVP reste en mémoire pour le comportement runtime, donc le travail de performance de la phase 7 se concentre sur l'observabilité et les chemins critiques évidents plutôt que sur le réglage de l'infrastructure.

## Signaux mesurés et exposés

- Nombre de requêtes.
- Nombre d'erreurs.
- Nombre d'erreurs critiques.
- Horodatage de la dernière requête.
- Durée p95 des requêtes sur les derniers échantillons de requêtes.
- Statut de santé dégradé lorsqu'une erreur runtime critique est observée.

## Revue des goulots d'étranglement actuels

- Le listing des cartes UGC effectue un filtrage et un tri en mémoire. C'est acceptable pour les données de démo MVP mais doit passer à des requêtes de base de données indexées avant le trafic de production.
- L'historique d'audit et de modération sont des tableaux en ajout seul dans les services runtime. C'est acceptable pour un processus de démo mais doit passer à un stockage durable pour la montée en charge et la récupération.
- La génération de types Next.js est désormais exécutée avant la vérification de types web pour éviter un comportement de validation instable autour des types de routes générés.

## Suivi production

- Persister les événements runtime et les audits dans PostgreSQL avec des politiques de rétention.
- Ajouter la pagination aux endpoints de liste avant un volume de données réel.
- Ajouter des index de base de données correspondant à `prisma/schema.prisma` pour le statut/popularité des cartes, l'action/date d'audit, les cibles de modération et la source/niveau/date des événements runtime.
- Ajouter des tests de charge pour la rejoindre la file d'attente, la soumission de résultat de match, la navigation de cartes, les achats et les lectures du tableau de bord admin.
