# Architecture Diagram

```mermaid
graph TD
    Player["BrightSign Player"]
    Bootstrap["autorun.brs<br/>(Bootstrap)"]
    NodeJS["index.js<br/>(Node.js Updater)"]
    Server["autorun.zip Server<br/>(HTTP Server)"]
    Zip["autorun.zip<br/>(Downloaded)"]
    Unzipped["Unzipped Files<br/>(New autorun.brs)"]
    Execute["Execute New<br/>autorun.brs"]
    Periodic["Periodic Update Check"]

    Player -->|"1. Boots & Launches"| Bootstrap
    Bootstrap -->|"2. Starts Node.js"| NodeJS
    NodeJS <-->|"3. HTTP GET<br/>Download autorun.zip"| Server
    Server -->|"4. Returns"| Zip
    Zip -->|"5. Unzip"| Unzipped
    Unzipped -->|"6. Extract"| Execute
    Execute -.->|"7. Cycle repeats"| Player
    Periodic <-.->|"Periodic checks"| Server

    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style Bootstrap fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style NodeJS fill:#7b68ee,stroke:#333,stroke-width:2px,color:#fff
    style Server fill:#f39c12,stroke:#333,stroke-width:2px,color:#fff
    style Zip fill:#ecf0f1,stroke:#333,stroke-width:2px,color:#333
    style Unzipped fill:#ecf0f1,stroke:#333,stroke-width:2px,color:#333
    style Execute fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
    style Periodic fill:#95a5a6,stroke:#333,stroke-width:2px,color:#fff
```

## Update Flow

1. Player boots and runs bootstrap autorun.brs
2. Bootstrap launches Node.js updater script
3. Updater downloads autorun.zip from SERVER_URL
4. Unzips package to extract new autorun.brs
5. Executes new autorun, replacing bootstrap
6. Process repeats with periodic checks (15 min)

## Configuration (index.ts)

-   `SERVER_URL`: Server endpoint
-   `CHECK_INTERVAL_MS`: 15 minutes
-   `STORAGE_PATH`: /storage/sd
-   Enables remote app updates

## Deployment Files

-   `/storage/sd/autorun.brs` (bootstrap)
-   `/storage/sd/index.js` (updater)

## Legend

-   **Blue**: BrightSign Player
-   **Orange**: BrightScript
-   **Purple**: Node.js Application
-   **Yellow-Orange**: External Server
-   **Light Gray**: File/Content
-   **Green**: Process/Action
-   **Gray**: Periodic Check
