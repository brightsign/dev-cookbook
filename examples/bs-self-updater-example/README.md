# bs-self-updater

A simple self-updating application written using TypeScript and designed to run on BrightSign players.

## Overview

`bs-app-updater` is a lightweight utility that allows an application running on BrightSign players to update itself by downloading and applying a new `autorun.zip` package. This enables remote updates and maintenance of deployed applications with minimal effort.

## Features

-   Calls a configurable server endpoint to download the `autorun.zip` application to run on the player.
    -   See `SERVER_URL` in `index.ts`.
-   Unzips the downloaded package and executes the `autorun.brs` file from the unzipped package.
-   Makes periodic calls to the server to check for any updates to the `autorun.zip` file.

## Getting Started

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm (Node Package Manager)

### Installation

1. Clone this repository or copy the code to your project directory.
2. Install dependencies (if any):
    ```sh
    npm install
    ```

### Build

Run the following command to compile the TypeScript code into JavaScript:

```sh
npm run build
```

### Deploy and run on player

1. Copy the `autorun.brs` file and `dist/index.js` files to the root of an SD card.
    - /storage/sd/autorun.brs
    - /storage/sd/index.js
2. Insert the SD card into the BrightSign player.
3. Boot up the player.

## Optional: Local Node.js Server for Testing

You can run a simple Node.js server locally to serve the `autorun.zip` file expected by the JS app. This is useful for development and testing.

### To start the server:

1. Navigate to the `server` directory:
    ```sh
    cd server
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Build the app:
    ```sh
     npm run build
    ```
4. Start the server:
    ```sh
    npm start
    ```
5. The server will listen on port 7000 by default and has a single endpoint to serve the `autorun.zip` file:
    ```
    http://localhost:7000/autorun.zip
    ```
