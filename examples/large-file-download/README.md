# Large File Download Example

## Introduction

This example demonstrates how to download a large file (multi-GB) to an SD card on a memory-constrained BrightSign player without running out of memory or blocking the UI.

The application is defined in `index.html` which uses Node.js streams via `roHtmlWidget` to download a file with true TCP-level backpressure. There is an `autorun.brs` file which tells the player to run the application.

## Why Not Use `fetch()`?

The browser's Fetch API does not propagate backpressure to the network layer. When downloading from a fast network connection to a slow SD card, `fetch()` will buffer the entire response body in memory — causing an OOM kill on devices with limited RAM (500 MB or less).

This example uses Node's `http`/`https` modules with `stream.pipeline()` instead. When the SD card's write buffer is full, backpressure propagates all the way back to the TCP socket, causing the sender to slow down. Memory usage stays bounded to roughly 48 KB (three stream buffers at 16 KB each) regardless of file size.

## How It Works

1. **Node.js HTTP request**: Uses `http.get()` / `https.get()` to initiate the download, which returns a native Node.js readable stream
2. **Metering Transform stream**: A passthrough `Transform` stream counts downloaded bytes for progress reporting
3. **`stream.pipeline()`**: Wires the response stream → meter → file write stream with automatic backpressure and error teardown
4. **Decoupled UI rendering**: A `requestAnimationFrame` loop updates progress, a CSS progress bar, and an FPS counter independently of the download — the main thread is never blocked
5. **Redirect handling**: Follows HTTP 3xx redirects since Node's `http.get` does not do this automatically

## Prerequisites

1. **Network connection**: The BrightSign player should be connected to a network with access to the file server.
2. **SD card**: The destination SD card should have enough free space for the downloaded file.

## Configuration

Edit the constants at the top of the `<script>` section in `index.html`:

- `VIDEO_URL`: The URL of the file to download
- `OUTPUT_FILE`: The destination path on the SD card (e.g. `/storage/sd/largevideo.mp4`)

## Steps to Set Up and Run the Application

### 1. Manual Transfer

1. Copy the `autorun.brs` and `index.html` files to the root of the SD card.
2. Insert the SD card into the player.
3. Reboot the player.

### 2. Automated Transfer Using BrightSign CLI for DWS

Configure the CLI by choosing a name for your player and passing your player's information:

`bsc local player --add --player playerName --ip ip-address --user username --pass password --storage sd`

Push files to the player:

`bsc local file --upload --player playerName --file ./index.html --destination sd/`
`bsc local file --upload --player playerName --file ./autorun.brs --destination sd/`

## Troubleshooting

- **No progress shown**: Verify the player is connected to the network and the `VIDEO_URL` is reachable from the player.
- **Slow download speed**: The download speed is limited by the slower of the network connection or the SD card write speed. This is by design — buffering faster than the SD card can write would consume memory.
