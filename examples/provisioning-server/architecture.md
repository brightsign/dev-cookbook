# Architecture Diagram

```mermaid
graph TD
    Player["BrightSign Player"]
    Server["Provisioning Server<br/>(Docker Container)<br/>Port 3000"]
    Database[("provisioning.db<br/>(SQLite)<br/>players, check_ins")]
    ProvisionScript["provision.brs<br/>(Downloads content)"]
    Content["content/<br/>autorun.brs<br/>index.html"]
    Browser["Web Browser<br/>(Admin Interface)<br/>/api/players<br/>/api/check-ins"]
    Periodic["Periodic Checks<br/>(Every 2 hours)<br/>Returns 204"]

    Player <-->|"HTTP GET /provision<br/>Device headers"| Server
    Server -->|"Logs data"| Database
    Server -.->|"Returns (last-resort)"| ProvisionScript
    ProvisionScript -->|Executes| Player
    ProvisionScript -.->|Downloads| Content
    Server -.->|"Serves via /content/*"| Content
    Browser <-->|"API Requests"| Server
    Periodic -.->|Scheduled| Player

    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style Server fill:#7b68ee,stroke:#333,stroke-width:2px,color:#fff
    style Database fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
    style ProvisionScript fill:#ecf0f1,stroke:#333,stroke-width:2px,color:#333
    style Content fill:#ecf0f1,stroke:#333,stroke-width:2px,color:#333
    style Browser fill:#95a5a6,stroke:#333,stroke-width:2px,color:#fff
    style Periodic fill:#f39c12,stroke:#333,stroke-width:2px,color:#fff
```

## Recovery Modes
- **last-resort**: No autorun (200 + provision.brs)
- **override**: Manual check
- **periodic**: Scheduled (204 or new autorun)

## Server Endpoints
- `/provision` - Provisioning endpoint
- `/content/*` - Static file server
- `/api/players` - List players (JSON)
- `/api/check-ins` - Check-in history
- `/health` - Health check

## Device Headers
DeviceId, DeviceModel, DeviceFamily, DeviceFwVersion, RecoveryMode, DeviceUpTime, StorageStatus

## Flow
1. Player boots, contacts server
2. Server logs check-in to database
3. Server returns provision.brs script
4. Script downloads content from server
5. Player installs and runs content
6. Player checks periodically for updates

## Legend
- **Blue**: BrightSign Player
- **Purple**: Provisioning Server
- **Green**: Database/Storage
- **Light Gray**: File/Content
- **Gray**: Network/Browser
- **Yellow-Orange**: Periodic Process
