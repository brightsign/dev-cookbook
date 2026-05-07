# Architecture Diagram

```mermaid
graph TD
    Player["BrightSign Player"]
    Autorun["autorun.brs<br/>(roHtmlWidget Config)<br/>trusted_iframes_enabled"]
    WebPage["Web Page<br/>(External HTML)"]
    Display["HDMI Display<br/>(Fullscreen)"]
    Iframe["Trusted Iframe<br/>(Has API Access)"]
    APIs["BrightSign APIs<br/>(JavaScript APIs,<br/>BS-JS objects,<br/>Node.js)"]

    Player -->|"Boots & Launches"| Autorun
    Autorun -->|"Creates roHtmlWidget<br/>Loads Web Page"| WebPage
    WebPage -->|"Renders Fullscreen"| Display
    WebPage -->|Contains| Iframe
    Iframe -->|"Access Enabled<br/>(via trusted_iframes_enabled)"| APIs

    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style Autorun fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style WebPage fill:#9b59b6,stroke:#333,stroke-width:2px,color:#fff
    style Display fill:#34495e,stroke:#333,stroke-width:2px,color:#fff
    style Iframe fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
    style APIs fill:#f39c12,stroke:#333,stroke-width:2px,color:#fff
```

## Default Behavior (BOS v9.1+)
- Iframes have NO API access
- Enhanced security by default

## roHtmlWidget Configuration
- `trusted_iframes_enabled: true`
- Enables JavaScript APIs in iframes
- Enables BS-JS objects in iframes
- Enables Node.js in iframes

## Security Warning
⚠️ **NOT RECOMMENDED for production**: Iframes gain access to core player APIs. Only use for trusted, controlled content.

Available in BOS v9.1.75.3+

## Legend
- **Blue**: BrightSign Player
- **Orange**: BrightScript
- **Purple**: Web Page
- **Green**: Trusted Iframe
- **Yellow-Orange**: BrightSign APIs
- **Dark Gray**: External Hardware
