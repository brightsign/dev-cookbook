# Hosting a Node.js Server Example

## Overview

This example is designed to help you get familiarized with running Node.js on a BrightSign player. It demonstrates how to run a Node.js server directly on the player that can serve both static files and device information. Additionally, it introduces tools and configurations that go beyond the basics covered in starter examples.

The core Node.js application is defined in `app.js`, which:
- Serves static files from the `/storage/sd/` directory
- Provides device information via a REST API endpoint
- Includes proper content-type handling for common file types

## Building and Running the Application

### Step 1: Install Dependencies
Ensure that Node.js is installed on your machine. From your project directory, install the necessary dependencies by running the following command:
```bash
npm install
```

Next, build and bundle the application:
```bash
npm run build
```

### Step 2: Transfer Files to the Player

#### Manual Transfer
After the application is bundled, you need to transfer the required files to your BrightSign player:
1. Copy the `bundle.js` file from the `dist` directory
2. Place the `bundle.js` file in the `dist` directory on the SD card
3. Place the `autorun.brs` file at the root of the SD card
4. Place any static files (HTML, CSS, images) you want to serve in the root of the SD card
5. Insert the SD card into the player

#### Automated Transfer Using BrightSign CLI for DWS
BrightSign's player CLI: [player-CLI](https://www.npmjs.com/package/@brightsign/bsc). To deploy this app with the CLI:

Configure the CLI by choosing a name for your player and passing your player's information:
```sh
bsc local player --add --player playerName --ip ip-address --user username --pass password --storage sd
```

This is an example command for pushing files to your player:
```sh
bsc local file --upload --player playerName --file ./path-to-your-file --destination sd/path-on-player
```

Alternatively, there is a script that can be run that is configured for this application:
```sh
npm run upload --playerName=playerName
```

### Step 3: Access the Server

Once the player is running, you can access the Node.js server from a web browser. Make sure your computer is connected to the same network as the BrightSign player.

#### Available Endpoints

1. Static Files:
   ```
   http://<player-ip>:13131/
   ```
   Serves files from the `/storage/sd/` directory. The root URL (`/`) will serve `index.html` if present.

2. Device Info API:
   ```
   http://<player-ip>:13131/api/device-info
   ```
   Returns JSON with device information like model, OS version, and serial number.

## Testing and mocking

This example is equipped with basic mocking to make testing easier with local development. In the `__mocks__` directory, there is a `deviceinfo.js` file which defines mock values when the application is run in a development environment.

To run the test(s) located in `App.test.js`, execute the following:
```bash
npm run test
```