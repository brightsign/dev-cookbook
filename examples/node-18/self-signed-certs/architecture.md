# Architecture Diagram

```mermaid
graph TD
    DevMachine["Development Machine<br/>(Your Computer)"]
    NodeJS["index.js<br/>(Node.js Script)<br/>undici Agent"]
    AgentConfig["HTTPS Agent<br/>rejectUnauthorized: false"]
    Network["Local Network"]
    Player["BrightSign Player"]
    DWS["Local DWS<br/>(Port 8443)<br/>HTTPS Endpoint<br/>/api/v1/status"]
    Cert["Self-Signed<br/>Certificate"]

    DevMachine -->|Runs| NodeJS
    NodeJS -->|Configures| AgentConfig
    NodeJS -->|"Via Local Network"| Network
    Network -->|"HTTPS Requests<br/>(Self-signed cert accepted)"| DWS
    Player -->|Provides| DWS
    Player -->|Uses| Cert
    DWS -->|"Responds with<br/>player status/data"| Network

    style DevMachine fill:#95a5a6,stroke:#333,stroke-width:2px,color:#fff
    style NodeJS fill:#7b68ee,stroke:#333,stroke-width:2px,color:#fff
    style AgentConfig fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
    style Network fill:#fff,stroke:#333,stroke-width:2px,color:#333,stroke-dasharray: 5 5
    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style DWS fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
    style Cert fill:#ecf0f1,stroke:#333,stroke-width:2px,color:#333
```

## Communication Flow
1. BrightSign player automatically generates self-signed certificate
2. DWS (Diagnostic Web Server) listens on port 8443 (HTTPS)
3. Node.js script configures undici Agent with `rejectUnauthorized: false` to accept self-signed certificates
4. Script makes HTTPS requests to DWS API endpoints (e.g., `/api/v1/status`)
5. DWS responds with player status/data in JSON format

## Security Note
⚠️ **Warning**: Only use `rejectUnauthorized: false` for trusted local player communication. Never use for external endpoints.

## Code Example
```javascript
const { Agent } = require('undici');

const httpsAgent = new Agent({
    connect: {
        rejectUnauthorized: false,
    },
});

const url = `https://${playerIP}:8443/api/v1/status`;
const response = await fetch(url, {
    dispatcher: httpsAgent
});
```

## Legend
- **Blue**: BrightSign Player
- **Purple**: Node.js Application
- **Green**: Service/API Configuration
- **Gray**: Development Machine
- **Light Gray**: File/Certificate
- **Dashed**: Network Connection
