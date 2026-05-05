# Examples

Welcome to the examples directory! Each example is independent and can be used based on your specific needs.

## Node Version Compatibility

BrightSign players ship with different Node.js versions depending on the OS:

- **BrightSign OS 8.x**: Node.js 14.17.6
- **BrightSign OS 9.x**: Node.js 18

Examples are organized into subdirectories based on their runtime requirements:

- **`browser/`** - HTML and BrightScript examples that run in the player's browser. No Node.js dependency.
- **`node-14/`** - Node.js examples compatible with BrightSign OS 8.x (Node 14.17.6).
- **`node-18/`** - Node.js examples requiring BrightSign OS 9.x (Node 18) or a dev machine with Node 18+.

Each Node.js example includes an `.nvmrc` file. Run `nvm use` in the example directory to switch to the correct version.

Note that some starter examples include the creation of a `brightsign-dumps` folder, which is used by the BrightSign OS to store crash information and is very useful to BrightSign Support when troubleshooting. The creation of this folder is an optional but recommended step to help with diagnosing application issues.

## Compatibility Matrix

### Browser Examples (`browser/`)

| Example | Description | BrightSign OS |
|---------|-------------|---------------|
| [html-starter](browser/html-starter) | Simple HTML app, displays images using a static directory | 8.x, 9.x |
| [indexeddb-caching](browser/indexeddb-caching) | Video caching using IndexedDB with smart playlist and background caching | 8.x, 9.x |
| [local-storage](browser/local-storage) | Image slideshow with localStorage caching for persistent playback | 8.x, 9.x |
| [bluetooth-scan](browser/bluetooth-scan) | Bluetooth device scanning using BrightSign's JS API | 8.x, 9.x |
| [bs-sqlite-db](browser/bs-sqlite-db) | SQLite database usage with BrightScript/JavaScript communication | 8.x, 9.x |
| [cec-interface](browser/cec-interface) | CEC commands via BrightScript and JavaScript implementations | 8.x, 9.x |
| [enable-ldws](browser/enable-ldws) | Enable Local Diagnostic Web Server with multiple approaches | 8.x, 9.x |
| [htmlwidget-iframes](browser/htmlwidget-iframes) | HTML widgets with iframes and security configuration | 8.x, 9.x |
| [send-plugin-message](browser/send-plugin-message) | Plugin message communication between BrightScript and HTML/JS | 8.x, 9.x |
| [syncmanager-js](browser/syncmanager-js) | Multi-player content synchronization using SyncManager JS API | 8.x, 9.x |
| [large-file-download](browser/large-file-download) | Memory-bounded multi-GB download using Node streams in roHtmlWidget | 8.x, 9.x |


### Node.js 14 Examples (`node-14/`)

| Example | Description | Node Version | Runs On |
|---------|-------------|-------------|---------|
| [node-starter](node-14/node-starter) | Minimal Node.js HTTP server for BrightSign | 14.17.6 | Player |
| [node-simple-server](node-14/node-simple-server) | Advanced Node.js server with REST API, Jest tests, and webpack | 14.17.6 | Player |

### Node.js 18 Examples (`node-18/`)

| Example | Description | Node Version | Runs On |
|---------|-------------|-------------|---------|
| [bs-self-updater](node-18/bs-self-updater) | TypeScript self-updating app that downloads and applies new autorun.zip packages | >=18 | Player |
| [provisioning-server](node-18/provisioning-server) | Docker-based provisioning server implementing BrightSign's provisioning protocol | >=18 | Dev Machine |
| [self-signed-certs](node-18/self-signed-certs) | Self-signed certificate handling using native fetch and undici | >=18 | Dev Machine |

## Next Steps

After exploring these examples, you can:

1. Combine concepts from different examples to build more complex applications
2. Add testing to your applications following the `node-simple-server` example
3. Implement plugin message communication for advanced BrightScript integration
4. Use one of the [templates](../templates) to start a production project
