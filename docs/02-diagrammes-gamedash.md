# Diagrammes GameDash (Mermaid)

## 1. Diagramme de contexte
```mermaid
flowchart LR
    J[Joueur] --> GD[GameDash]
    S[Staff / Live Ops] --> GD
    A[Admin] --> GD
    E[Editeur de maps en jeu] --> GD
    GD --> P[(Paiement simule)]
    GD --> M[(Monitoring / Logs)]
```

## 2. Cas d'usage principaux
```mermaid
flowchart TB
    subgraph Joueur
      U1[Creer compte / se connecter]
      U2[Entrer en file de matchmaking]
      U3[Consulter MMR/rang/historique]
      U4[Acheter en boutique]
      U5[Publier et versionner une map]
      U6[Voter/tester/favoriser une map]
    end

    subgraph Studio
      S1[Suivre KPI activite]
      S2[Ajuster parametres MMR/rangs]
      S3[Ajuster economie]
      S4[Moderer comptes/maps]
      S5[Mettre en avant des maps]
    end
```

## 3. Diagramme de composants applicatifs
```mermaid
flowchart LR
    WEB[Web App Joueur/Admin] --> API[API Gateway / BFF]

    API --> AUTH[Auth & RBAC]
    API --> MM[Matchmaking Service]
    API --> RANK[MMR & Ranks Service]
    API --> PROG[Progression Service]
    API --> ECO[Economy Service]
    API --> UGC[Maps UGC Service]
    API --> BO[Backoffice Service]
    API --> AUDIT[Audit/Logs Service]

    AUTH --> DB[(PostgreSQL)]
    MM --> DB
    RANK --> DB
    PROG --> DB
    ECO --> DB
    UGC --> DB
    BO --> DB
    AUDIT --> DB

    MM --> CACHE[(Redis)]
    BO --> BI[(KPI Views)]
```

## 4. Modèle de données (ERD simplifié)
```mermaid
erDiagram
    USER ||--|| PROFILE : has
    USER ||--o{ PLAYER_MMR : owns
    USER ||--o{ MATCH_PARTICIPANT : plays
    USER ||--o{ TRANSACTION : makes
    USER ||--o{ INVENTORY_ITEM : owns
    USER ||--o{ MAP : creates
    USER ||--o{ MAP_VOTE : votes
    USER ||--o{ MAP_TEST : tests
    USER ||--o{ SANCTION : receives
    USER ||--o{ AUDIT_LOG : triggers

    MATCH ||--o{ MATCH_PARTICIPANT : contains
    GAME_MODE ||--o{ MATCH : classifies
    GAME_MODE ||--o{ PLAYER_MMR : scopes

    RANK_CONFIG ||--o{ PLAYER_MMR : maps

    STORE_ITEM ||--o{ TRANSACTION : sold_as
    TRANSACTION ||--o{ INVENTORY_ITEM : grants

    MAP ||--o{ MAP_VERSION : versions
    MAP ||--o{ MAP_VOTE : receives
    MAP ||--o{ MAP_TEST : receives
    MAP ||--o{ MAP_FAVORITE : receives
    MAP ||--o{ MAP_MODERATION_EVENT : moderated_by
```

## 5. Séquence - matchmaking + mise à jour MMR
```mermaid
sequenceDiagram
    participant J as Joueur
    participant W as Web App
    participant Q as Matchmaking
    participant MM as MMR Service
    participant DB as DB

    J->>W: Join queue (mode classe)
    W->>Q: POST /queues/join
    Q->>DB: Upsert queue state
    Q-->>W: queue_status=waiting

    Q->>Q: Match players by MMR + wait time
    Q->>DB: Create Match + participants
    Q-->>W: match_found

    W->>Q: Report result
    Q->>MM: Compute new MMR (Elo simplifie)
    MM->>DB: Persist PLAYER_MMR + rank
    MM-->>Q: Updated ratings
    Q->>DB: Persist audit log
    Q-->>W: Match closed + rewards XP
```

## 6. Séquence - publication/versionnage de map
```mermaid
sequenceDiagram
    participant J as Joueur
    participant W as Web App
    participant U as UGC Service
    participant BO as Backoffice
    participant DB as DB

    J->>W: Publish map (title, tags, status)
    W->>U: POST /maps
    U->>DB: Create MAP + MAP_VERSION(v1)
    U->>DB: Write audit log
    U-->>W: Map published

    J->>W: Update map + release notes
    W->>U: POST /maps/{id}/versions
    U->>DB: Create MAP_VERSION(v2..n)
    U-->>W: New version saved

    J->>W: Community votes/tests
    W->>U: POST /maps/{id}/vote|test
    U->>DB: Save interaction + recompute popularity
    U-->>BO: Emit analytics event
```

## 7. État joueur dans le matchmaking
```mermaid
stateDiagram-v2
    [*] --> Offline
    Offline --> Online : login
    Online --> InQueue : join_queue
    InQueue --> InMatch : match_found
    InQueue --> Online : leave_queue
    InMatch --> Online : match_finished
    Online --> Offline : logout
```
