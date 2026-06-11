# Architecture Diagram

```mermaid
graph TD
    Player["BrightSign Player"]
    Autorun["autorun.brs<br/>(BrightScript)"]
    HTML["index.html<br/>(Dual Video Elements)"]
    Bundle["index.js<br/>(Switching Logic)"]
    Display["HDMI Display<br/>(Video Output)"]
    Assets[("assets/<br/>(Video Files<br/>.mp4, .ts)")]
    Player1["Video Player 1<br/>(Visible/Hidden)"]
    Player2["Video Player 2<br/>(Hidden/Visible)"]

    Player -->|"Boots & Launches"| Autorun
    Autorun -->|"Creates roHtmlWidget<br/>Loads HTML"| HTML
    HTML -->|"Loads & Executes"| Bundle
    Bundle -->|"Reads Video Files"| Assets
    Bundle -->|"Controls Playback<br/>& Visibility"| Player1
    Bundle -->|"Controls Playback<br/>& Visibility"| Player2
    Player1 -->|"Renders Video"| Display
    Player2 -->|"Renders Video"| Display

    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style Autorun fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style HTML fill:#9b59b6,stroke:#333,stroke-width:2px,color:#fff
    style Bundle fill:#7b68ee,stroke:#333,stroke-width:2px,color:#fff
    style Display fill:#34495e,stroke:#333,stroke-width:2px,color:#fff
    style Assets fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
    style Player1 fill:#e74c3c,stroke:#333,stroke-width:2px,color:#fff
    style Player2 fill:#e74c3c,stroke:#333,stroke-width:2px,color:#fff
```

## Seamless Video Switching Flow

1. **Initial Load**: Player 1 loads and plays the first video
2. **Preload**: While Player 1 plays, Player 2 preloads the next video (hidden)
3. **Switch Trigger**: When Player 1 ends, the switching sequence begins
4. **Start Hidden Player**: Player 2 starts playing (while still hidden)
5. **Wait for Playback**: Wait until Player 2 is actually playing
6. **Instant Transition**: Player 2 becomes visible, Player 1 becomes hidden
7. **Background Preload**: Player 1 (now hidden) preloads the next video
8. **Loop**: Repeat steps 3-7 indefinitely for continuous playback

## Key Features

- **Zero-Gap Transitions**: No black screens or freeze frames between videos
- **Dual Player Technique**: Two HTML5 video elements layered using absolute positioning
- **Background Preloading**: Next video is fully loaded before current video ends
- **Instant Visibility Toggle**: CSS class switching provides immediate visual transition
- **Alphabetical Playback**: Videos are sorted and played in alphabetical order
- **Infinite Loop**: Playlist automatically loops back to the first video

## Legend

- **Blue**: BrightSign Player
- **Orange**: BrightScript
- **Purple**: HTML/JS Application
- **Purple (Dark)**: JavaScript Logic
- **Dark Gray**: External Hardware
- **Green**: Video Files
- **Red**: Video Player Elements
