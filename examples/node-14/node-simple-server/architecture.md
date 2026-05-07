# Architecture Diagram

```mermaid
graph TD
    Player["BrightSign Player"]
    Autorun["autorun.brs<br/>(BrightScript)"]
    NodeJS["app.js<br/>(Node.js HTTP Server)<br/>Port 13131"]
    Static["storage/sd/<br/>(HTML, CSS, JS, Images)"]
    API["Device Info API<br/>/api/device-info<br/>(Model, OS, Serial)"]
    Browser["Web Browser<br/>http://player-ip:13131/"]

    Player -->|"Boots & Launches"| Autorun
    Autorun -->|"Starts Node.js Process"| NodeJS
    NodeJS -.->|"Serves Files"| Static
    NodeJS -->|Provides| API
    Browser <-->|"HTTP GET<br/>Static files & API"| NodeJS

    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style Autorun fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style NodeJS fill:#7b68ee,stroke:#333,stroke-width:2px,color:#fff
    style Static fill:#ecf0f1,stroke:#333,stroke-width:2px,color:#333
    style API fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
    style Browser fill:#95a5a6,stroke:#333,stroke-width:2px,color:#fff
```

## Endpoints

-   `/` → index.html
-   `/api/device-info` → JSON

## Legend

-   **Blue**: BrightSign Player
-   **Orange**: BrightScript
-   **Purple**: Node.js Application
-   **Green**: API Endpoint
-   **Light Gray**: File/Content
-   **Gray**: Network/Browser
