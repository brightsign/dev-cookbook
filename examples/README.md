# Examples

Welcome to the examples directory! This guide will help you get started with the provided examples. Each example is independent and can be used based on your specific needs.

## Available Examples

### HTML & Web Storage Examples

#### HTML Starter Example
- **Location**: `examples/html-starter-example`
- **Features**: Simple HTML application for BrightSign, demonstrates running HTML and displaying images using a static directory. Great for getting started with HTML on BrightSign.

#### IndexedDB Caching Example
- **Location**: `examples/indexeddb-caching-example`
- **Features**: Demonstrates video caching using IndexedDB in a BrightSign HTML5 app. Implements a smart playlist and background caching for smooth video playback.

#### Local Storage Example
- **Location**: `examples/local-storage-example`
- **Features**: Image slideshow that caches images in browser localStorage for persistent, smooth playback and looping.

### Node.js Examples

#### Node Starter Example
- **Location**: `examples/node-starter-example`
- **Features**: Minimal Node.js HTTP server for BrightSign. Boots a simple server and responds to requests at the root endpoint.

#### Node Simple Server Example
- **Location**: `examples/node-simple-server-example`
- **Features**: Advanced Node.js server with static file serving, device info REST API, Jest tests, and webpack config. Good for learning about full-featured Node.js deployments on BrightSign.

### Device & Plugin Integration Examples

#### Bluetooth Scan Example
- **Location**: `examples/bluetooth-scan-example`
- **Features**: HTML+JS app for scanning Bluetooth devices on BrightSign. Requires a compatible Bluetooth adapter and uses BrightSign's proprietary JS API.

#### BS Self Updater Example
- **Location**: `examples/bs-self-updater-example`
- **Features**: TypeScript utility for self-updating BrightSign apps by downloading and applying new `autorun.zip` packages from a server.

#### BS SQLite DB Example
- **Location**: `examples/bs-sqlite-db-example`
- **Features**: Demonstrates SQLite database usage on BrightSign, including table creation, data insertion, querying, and cleanup via BrightScript and JavaScript communication.

#### Send Plugin Message Example
- **Location**: `examples/send-plugin-message`
- **Features**: Shows how to send plugin messages between BrightScript and HTML/JavaScript apps, useful for integrating BrightAuthor:connected presentations with custom logic.

## Next Steps

After exploring these examples, you can:
1. Combine concepts from different examples to build more complex applications
2. Add testing to your applications following the `node-simple-server` example
3. Implement plugin message communication for advanced BrightScript integration
