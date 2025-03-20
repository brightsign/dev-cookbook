# HTML Single Video Example

This example demonstrates how to run an html web application that plays videos in sequence using a single video decoder.

## Building and Running the Application

### Step 1: Install Dependencies
Ensure that Node.js is installed on your machine. From your project directory, install the necessary dependencies by running the following command:

```bash
npm install
```

Next, build and bundle the application:

For the development environment:
```bash
npm run build
```

For the production environment:
```bash
npm run build:prod
```

### Step 2: Transfer Files to the Player

**Note:** When adding your own video assets, make sure to:
1. Create a folder (e.g., `media` or `assets`) at the root of the SD card to store your video files
2. Update the asset file names in the code to match your actual video file names and their location on the SD card

#### Option 1: Manual Transfer
After the application is bundled, you need to transfer the required files to your BrightSign player:
- Copy the `bundle.js` file from the `dist` directory.
- Place the `bundle.js` file in the `dist` directory and the `autorun.brs` file at the root of the SD card.
- Insert the SD card into the player.

#### Option 2: BrightSign Player CLI

BrightSign's player CLI: [player-CLI](https://github.com/brightsign/player-cli). Instructions for installation can be found in the CLI repo readme. To deploy this app with the CLI:
```sh
bsc putfile playerName dist dist
bsc putfile playerName src/autorun.brs
```

If you have any additional files, include those too. For example, if you have media stored in a `media/` directory, use:
```sh
bsc putfile playerName media
```
The above will put the media files on the root of the SD card. If they are referenced out of a directory, for example a `media/` directory on the SD card, use:
```sh
bsc putfile playerName media media
```

Then, restart the app on your player. Refer to [restarting the app](#restarting-the-app-on-the-player)

#### Provided Bash Scripts

The BrightSign bash script(s) are contained in the `scripts/` directory. Follow the steps below to deploy built code to your player. 

Set the following environment variables:
```sh
export PLAYER="<IP address or hostname of the player>"
# e.g. export PLAYER="192.168.86.1"

# only needed when ldws password is set
export PLAYER_PW="<password, which is the serial number by default>"
# e.g. export PLAYER_PW="abcd"
```

Combine building the app and deploying the app with:
```sh
npm run put
```

Or to deploy the development version of your code:
```sh
npm run put:prod
```

[Back to deployment options](#step-2-transfer-files-to-the-player)

### Step 3: Observe the application on your player

You should now see the display connected to your player showing the content you uploaded, switching between videos seemlessly.