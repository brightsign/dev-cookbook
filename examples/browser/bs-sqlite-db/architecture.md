# Architecture Diagram

```mermaid
graph LR
    Player["BrightSign Player"]
    Autorun["autorun.brs<br/>(BrightScript)"]
    NodeJS["index.js<br/>(Node.js)"]
    DB[("example.db<br/>(SQLite)")]

    Player -->|Launches| Autorun
    Autorun <-.->|"MessagePort<br/>SQL commands & results"| NodeJS
    Autorun <-->|"SQL Operations<br/>(CREATE, INSERT, SELECT, DELETE)"| DB

    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style Autorun fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style NodeJS fill:#7b68ee,stroke:#333,stroke-width:2px,color:#fff
    style DB fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
```

## Legend
- **Blue**: BrightSign Player
- **Orange**: BrightScript
- **Purple**: Node.js Application
- **Green**: Database/Storage
- **Solid Arrow**: Launches/Executes
- **Dashed Arrow**: MessagePort/IPC
- **Bidirectional Arrow**: SQL Operations
