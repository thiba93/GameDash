# Référentiel de sécurité

## RBAC
- Rôles : `player`, `staff`, `admin`.
- Rôle par défaut à l'inscription : `player`.
- Les routes staff/admin doivent rejeter les rôles non privilégiés.

## Référentiel d'authentification
- Email + mot de passe (haché, jamais stocké en clair).
- Token d'accès JWT + token de rafraîchissement.
- Le token de rafraîchissement doit être révocable côté serveur.
- Le runtime de la phase 1 utilise des hachages de mots de passe PBKDF2-SHA512 et des tokens d'accès signés par HMAC.
- Les valeurs des tokens de rafraîchissement sont stockées uniquement sous forme hachée et sont renouvelées à chaque rafraîchissement.

## Sécurité des entrées et sorties
- Valider toutes les charges utiles à la frontière du contrôleur.
- Rejeter les champs inconnus dans la mesure du possible.
- Assainir les textes générés par les utilisateurs avant leur affichage dans le frontend.

## Exigences de journalisation des audits
Actions critiques devant être journalisées :
- Authentification : inscription, connexion, rafraîchissement, déconnexion.
- Profil : mise à jour du profil joueur.
- Sanctions de compte.
- Mises à jour du MMR après le résultat d'un match.
- Attributions d'XP de progression et octrois de récompenses de montée de niveau.
- Transactions économiques.
- Publication/mise à jour de cartes et actions de modération.

Exigence runtime de la phase 2 :
- La soumission du résultat d'un match doit écrire une entrée d'audit par mise à jour de MMR de participant.
- Les métadonnées d'audit du MMR doivent inclure l'id du match, le mode, le MMR précédent, le MMR suivant, le delta, le rang précédent et le rang suivant.

Exigence runtime de la phase 3 :
- La soumission du résultat d'un match ne doit attribuer des XP qu'après acceptation d'un résultat de match valide.
- Les métadonnées d'audit des XP doivent inclure l'id du match, le mode, le résultat, les XP attribués, le niveau précédent, le niveau suivant, les XP cumulés précédents, les XP cumulés suivants et les codes de récompenses accordées.
- Les récompenses de montée de niveau ne doivent être accordées qu'une seule fois par joueur et par code de récompense.

Exigence runtime de la phase 4 :
- Les demandes d'achat doivent créer une entrée de transaction en ajout seul pour les résultats acceptés et rejetés.
- Les achats acceptés doivent débiter exactement une devise de portefeuille, accorder ou incrémenter exactement un article d'inventaire, et écrire une entrée d'audit d'achat.
- Les achats rejetés ne doivent pas modifier les soldes de portefeuille ni les quantités d'inventaire.
- Les métadonnées d'audit d'achat doivent inclure l'id de l'article en boutique, le code de l'article, la devise, la quantité, le montant, le solde précédent, le solde suivant et la raison du rejet le cas échéant.
- Le comportement de paiement est simulé pour le MVP et ne doit pas appeler ni nécessiter de vraies informations d'identification de paiement.

Exigence runtime de la phase 5 :
- La création d'une carte avec un statut publié doit écrire une entrée d'audit `map.publish`.
- La création d'une version de carte doit écrire une entrée d'audit `map.update` avec l'id de version et le libellé de version.
- Les réponses de recherche UGC doivent masquer les cartes `hidden` sauf si un filtre de statut les demande explicitement.
- Le score de popularité doit être dérivé des votes, des tests complétés, des favoris, du nombre de versions et de la récence, et non d'une entrée brute contrôlée par l'utilisateur.
- Les données de carte pertinentes pour la modération doivent inclure le statut, les métadonnées de révision, les signalements et les événements de modération pour les workflows staff ultérieurs.

Exigence runtime de la phase 6 :
- Le staff et l'admin peuvent lire le tableau de bord, les paramètres, les signaux de modération et l'historique de modération.
- Seul l'admin peut mettre à jour les paramètres du studio.
- Le staff et l'admin peuvent appliquer des actions de modération sur les comptes et les cartes.
- Les mises à jour de paramètres et les actions de modération doivent écrire des entrées d'audit avec l'id de l'acteur, l'id de la cible, l'action, la raison et les métadonnées pertinentes.
- L'historique de modération doit être en ajout seul dans le référentiel runtime.

Exigence runtime de la phase 7 :
- Chaque réponse HTTP doit inclure ou préserver un `x-request-id` pour la traçabilité.
- Les échecs d'API doivent utiliser l'enveloppe d'erreur standard avec code, message, status, path, timestamp et request id.
- Les champs de requête inconnus sont rejetés par le pipe de validation global.
- Les échecs RBAC doivent retourner des réponses explicites `403 Forbidden`.
- Les flux critiques joueur et studio doivent rester couverts par la suite de tests de style intégration.
- La sortie de santé doit exposer le nombre de requêtes/erreurs et la durée p95 pour le diagnostic de base.

## Gestion des secrets et de l'environnement
- Ne jamais commiter de vrais secrets.
- Utiliser `.env.example` comme contrat uniquement.
- Conserver les secrets JWT et DB en dehors du contrôle de source.

## Données et transport
- Utiliser TLS dans les environnements non locaux.
- Appliquer le principe de moindre privilège sur les identifiants DB.
- Stocker les horodatages en UTC.

## Menaces considérées pour le MVP
- Tentatives d'élévation de privilèges.
- Contrôle d'accès défaillant.
- Rejeu ou abus du token de rafraîchissement.
- Falsification des endpoints de transaction.
- Abus/spam sur les endpoints UGC.
