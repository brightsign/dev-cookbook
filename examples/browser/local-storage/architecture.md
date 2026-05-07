# Architecture Diagram

```mermaid
graph TD
    Player["BrightSign Player"]
    Autorun["autorun.brs<br/>(BrightScript)"]
    HTML["index.html<br/>(HTML/JS Slideshow)"]
    Display["HDMI Display<br/>(Slideshow Output)"]
    Storage[("localStorage<br/>(Cached Images<br/>as base64)")]
    Network["Remote Images<br/>(Network)"]

    Player -->|"Boots & Launches"| Autorun
    Autorun -->|"Creates roHtmlWidget<br/>Loads HTML"| HTML
    HTML -->|"Renders Slideshow"| Display
    HTML <-->|"Downloads Images"| Network
    HTML <-->|"Stores/Retrieves<br/>(base64 encoded)"| Storage

    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style Autorun fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style HTML fill:#9b59b6,stroke:#333,stroke-width:2px,color:#fff
    style Display fill:#34495e,stroke:#333,stroke-width:2px,color:#fff
    style Storage fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
    style Network fill:#95a5a6,stroke:#333,stroke-width:2px,color:#fff
```

## Flow
1. Check localStorage for cached images
2. Download missing images from network
3. Convert to base64 & cache in localStorage
4. Display slideshow from cached images
5. Loop continuously

## Legend
- **Blue**: BrightSign Player
- **Orange**: BrightScript
- **Purple**: HTML/JS Application
- **Dark Gray**: External Hardware
- **Green**: Browser Storage
- **Gray**: Network/Remote
