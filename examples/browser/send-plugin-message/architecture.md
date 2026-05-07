# Architecture Diagram

```mermaid
graph TD
    Player["BrightSign Player"]
    Presentation["plugin-message-transfer.bpfx<br/>(BA:c Presentation)"]
    Widgets["Video Widgets<br/>(TimeoutEvents)"]
    BrightScript["pluginMessageTransfer.brs<br/>(Message Handler)"]
    HTML["pluginMessageApp.html<br/>(Message Receiver)"]
    Backend["Backend Server<br/>(Optional Processing)"]

    Player -->|Runs| Presentation
    Presentation -->|Contains| Widgets
    Widgets -->|"1. Triggers Plugin Message<br/>(on TimeoutEvent)"| BrightScript
    BrightScript -->|"2. Forwards Message"| HTML
    HTML -.->|"3. Sends to Backend<br/>(Optional)"| Backend

    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style Presentation fill:#9b59b6,stroke:#333,stroke-width:2px,color:#fff
    style Widgets fill:#ecf0f1,stroke:#333,stroke-width:2px,color:#333
    style BrightScript fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style HTML fill:#9b59b6,stroke:#333,stroke-width:2px,color:#fff
    style Backend fill:#f39c12,stroke:#333,stroke-width:2px,color:#fff
```

## Plugin Message Format
```
pluginMessage!!<serialNumber>!!<filename>
```

## Example Flow
1. Video plays in widget
2. TimeoutEvent fires
3. Plugin message sent: `pluginMessage!!D5E86P001287!!1stVideo`
4. BrightScript receives & forwards
5. HTML app processes message
6. Optional: Forward to backend API

## Legend
- **Blue**: BrightSign Player
- **Orange**: BrightScript
- **Purple**: Presentation/HTML
- **Yellow-Orange**: External Server
- **Light Gray**: Widget/Content
