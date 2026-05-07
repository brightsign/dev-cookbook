# Architecture Diagram

## Three Methods to Enable LDWS

```mermaid
graph TD
    subgraph Method1["Method 1: BrightScript - Recommended"]
        M1Player["BrightSign Player"]
        M1Autorun["autorun.brs<br/>roNetworkConfiguration"]
        M1LDWS["LDWS Enabled<br/>(Port 80)"]

        M1Player -->|Launches| M1Autorun
        M1Autorun -->|"SetupDWS()<br/>password"| M1LDWS
    end

    subgraph Method2["Method 2: Node.js"]
        M2Player["BrightSign Player"]
        M2Autorun["autorun.brs"]
        M2NodeJS["index.js<br/>@brightsign/dwsconfiguration"]
        M2LDWS["LDWS Enabled<br/>(Port 80)"]

        M2Player -->|Launches| M2Autorun
        M2Autorun -->|"Starts Node.js"| M2NodeJS
        M2NodeJS -->|"Configure<br/>password"| M2LDWS
    end

    subgraph Method3["Method 3: Registry - Not Recommended"]
        M3Player["BrightSign Player"]
        M3Autorun["autorun.brs<br/>Registry Write"]
        M3LDWS["LDWS Enabled<br/>(No Password)"]

        M3Player -->|Launches| M3Autorun
        M3Autorun -->|"Write registry<br/>http_server, dwse"| M3LDWS
    end

    Browser["Web Browser<br/>https://device-ip/"]

    M1LDWS -->|HTTP Access| Browser
    M2LDWS -->|HTTP Access| Browser
    M3LDWS -->|HTTP Access| Browser

    style M1Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style M1Autorun fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style M1LDWS fill:#50c878,stroke:#333,stroke-width:2px,color:#fff

    style M2Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style M2Autorun fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style M2NodeJS fill:#7b68ee,stroke:#333,stroke-width:2px,color:#fff
    style M2LDWS fill:#50c878,stroke:#333,stroke-width:2px,color:#fff

    style M3Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style M3Autorun fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style M3LDWS fill:#50c878,stroke:#333,stroke-width:2px,color:#fff

    style Browser fill:#95a5a6,stroke:#333,stroke-width:2px,color:#fff
```

## Legend
- **Blue**: BrightSign Player
- **Orange**: BrightScript
- **Purple**: Node.js Application
- **Green**: Service/LDWS
- **Gray**: Web Browser

## Result
All three methods enable LDWS, allowing access via web browser to https://device-ip/
