# Architecture Diagram

```mermaid
graph TD
    Player["BrightSign Player"]
    Autorun["autorun.brs<br/>(BrightScript)"]
    HTML["index.html<br/>(Video Player)"]
    Display["HDMI Display<br/>(Video Playback)"]
    IndexedDB[("videos_db<br/>(IndexedDB)<br/>Video Blobs")]
    Network["Remote Videos<br/>(Network)<br/>Google Test Videos"]

    Player -->|"Boots & Launches"| Autorun
    Autorun -->|"Creates roHtmlWidget<br/>Loads HTML"| HTML
    HTML -->|"Displays Videos"| Display
    HTML <-->|"Downloads Videos<br/>(Background caching)"| Network
    HTML <-->|"Stores/Retrieves<br/>Video Blobs"| IndexedDB

    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style Autorun fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style HTML fill:#9b59b6,stroke:#333,stroke-width:2px,color:#fff
    style Display fill:#34495e,stroke:#333,stroke-width:2px,color:#fff
    style IndexedDB fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
    style Network fill:#95a5a6,stroke:#333,stroke-width:2px,color:#fff
```

## Caching Strategy
1. Create IndexedDB (videos_db/videos_os)
2. Check cache for existing videos
3. Play first video (cached or download)
4. Background download remaining videos
5. Store video blobs in IndexedDB
6. Subsequent playback from cache
7. Auto-advance & loop playlist

## Storage
- IndexedDB for large storage capacity
- Videos stored as blobs
- Uses available disk space
- Better than localStorage (5MB limit)

## Legend
- **Blue**: BrightSign Player
- **Orange**: BrightScript
- **Purple**: HTML/JS Application
- **Dark Gray**: External Hardware
- **Green**: IndexedDB Storage
- **Gray**: Network/Remote
