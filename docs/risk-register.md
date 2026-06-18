# Registre des risques

| ID | Risque | Impact | Déclencheur | Atténuation | Responsable |
|---|---|---|---|---|---|
| R1 | Dérive du périmètre vers des fonctionnalités optionnelles | Élevé | Le travail P2 commence avant la clôture P0 | Appliquer la porte P0 dans le backlog et les règles AGENTS | Responsable produit |
| R2 | Incohérence de la logique MMR | Élevé | Formules différentes utilisées entre les modules | Contrat MMR unique + types partagés + tests | Responsable backend |
| R3 | Gestion auth/session défaillante | Élevé | Rotation de rafraîchissement manquante ou hygiène des secrets | Référentiel de sécurité + discipline env + règles d'audit | Responsable backend |
| R4 | Corruption des données économiques | Élevé | Écritures de transaction non idempotentes | Modèle de transaction + invariants explicites + journal d'audit | Responsable backend |
| R5 | Lacune de modération UGC | Moyen | Contenu nuisible non actionnable | Entités de modération + endpoints admin + journal de décision | Produit/staff |
| R6 | Fragmentation de la configuration locale | Moyen | L'équipe ne peut pas faire tourner le même stack localement | Guide de configuration native + vérifications de santé + template env | Responsable technique |
| R7 | Dérive de contrat entre API et types partagés | Moyen | Désaccord DTO lors de l'implémentation | OpenAPI-first + politique de synchronisation `packages/contracts` | Responsable technique |
| R8 | Instabilité temps réel | Moyen | Les déconnexions WebSocket dégradent l'UX | Documenter le fallback par polling et exposer les endpoints de fallback | Responsable full-stack |
