# Architecture Diagram

```mermaid
graph TD
    Player["BrightSign Player"]
    Bootstrap["autorun.brs<br/>Boot launcher"]
    Uploader["index.js<br/>Node.js uploader"]
    Registry["Custom registry section<br/>crash_dump_example"]
    Dumps["brightsign-dumps<br/>Crash dump files"]
    State["last_uploaded_dump<br/>Last uploaded file marker"]
    Server["Custom server<br/>POST /crashdump"]
    Received["received-dumps<br/>Saved uploads"]

    Player -->|"Boots after crash or power cycle"| Bootstrap
    Bootstrap -->|"Writes upload URL"| Registry
    Bootstrap -->|"Starts roNodeJs"| Uploader
    Uploader -->|"Reads upload URL"| Registry
    Uploader -->|"Scans on startup"| Dumps
    Uploader -->|"Checks and updates"| State
    Uploader -->|"Raw binary POST with device headers"| Server
    Server -->|"Stores body"| Received

    style Player fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style Bootstrap fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
    style Uploader fill:#7b68ee,stroke:#333,stroke-width:2px,color:#fff
    style Dumps fill:#ecf0f1,stroke:#333,stroke-width:2px,color:#333
    style State fill:#ecf0f1,stroke:#333,stroke-width:2px,color:#333
    style Server fill:#f39c12,stroke:#333,stroke-width:2px,color:#fff
    style Received fill:#50c878,stroke:#333,stroke-width:2px,color:#fff
```

## Boot Upload Flow

1. Player boots and runs `autorun.brs`.
2. `autorun.brs` ensures `SD:/brightsign-dumps` exists and starts `index.js` with `roNodeJs`.
3. `autorun.brs` writes the upload URL to the custom registry section `[crash_dump_example] upload_url`.
4. `index.js` reads the upload URL with `@brightsign/registry`.
5. `index.js` detects the default storage path with `@brightsign/storage.priorityOrder` when available.
6. The app scans the configured dump folder, sorts dump files oldest-to-newest, and compares each current file to the last uploaded timestamp in registry.
7. Each new dump is posted to the configured `POST /crashdump` endpoint as a raw binary request body.
8. After each 2xx response, the app records the upload in `[crash_dump_example] last_uploaded_dump`.
9. If `DELETE_AFTER_UPLOAD` is enabled, the app deletes the local dump after state is written.

## Configuration

-   `REGISTRY_SECTION`: Custom registry section name, default `crash_dump_example`.
-   `UPLOAD_URL_REGISTRY_KEY`: Custom registry key name, default `upload_url`.
-   `LAST_UPLOADED_DUMP_REGISTRY_KEY`: Custom registry key used to prevent duplicate uploads, default `last_uploaded_dump`.
-   `DELETE_AFTER_UPLOAD`: Optional cleanup behavior after a successful upload.
-   `REQUEST_TIMEOUT_MS`: Per-request upload timeout.
