# Hosting a Node.js Server Example

## Overview

This example is designed to help you get familiarized with running Node.js on a BrightSign player. It demonstrates how to run a Node.js server directly on the player that can serve both static files and fetch device information. Additionally, it introduces tools and configurations that go beyond the basics covered in starter examples.  

The core Node.js application is defined in `app.js`, which:
- Serves static files from the `/storage/sd/` directory
- Provides device information via a REST API endpoint
- Includes proper content-type handling for common file types

## Static File Serving

This example includes a built-in static file server that serves files from the `/storage/sd/` directory. The server:
- Automatically serves `index.html` when accessing the root URL (`/`)
- Handles common file types with appropriate content-type headers (HTML, CSS, JavaScript, images)
- Returns 404 errors for files that don't exist

### Example Usage

1. Create an `index.html` file in your SD card root:
```html
<!DOCTYPE html>
<html>
<head>
    <title>My BrightSign App</title>
</head>
<body>
    <h1>Hello from BrightSign!</h1>
    <div id="device-info"></div>
    <script>
        // Fetch and display device info
        fetch('/api/device-info')
            .then(response => response.json())
            .then(data => {
                document.getElementById('device-info').innerHTML = 
                    `Model: ${data.model}<br>
                     OS Version: ${data.osVersion}`;
            });
    </script>
</body>
</html>
```

2. Access your content:
   - Main page: `http://<player-ip>:13131/`
   - Individual files: `http://<player-ip>:13131/styles.css`, `http://<player-ip>:13131/images/logo.png`, etc.

3. Supported file types:
   - HTML (`.html`): `text/html`
   - JavaScript (`.js`): `text/javascript`
   - CSS (`.css`): `text/css`
   - JSON (`.json`): `application/json`
   - Images (`.png`, `.jpg`): `image/png`, `image/jpeg`
   - Other files: `text/plain`

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
1. Copy the `dist` folder to the SD card
2. Place the `autorun.brs` file at the root of the SD card
3. Place any static files (HTML, CSS, images) you want to serve in the root of the SD card
4. Insert the SD card into the player
5. Reboot the player

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