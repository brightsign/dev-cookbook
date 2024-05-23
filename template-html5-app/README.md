# template-html5 - player-app

In this directory, you'll discover how to develop a straightforward web application tailored for BrightSign players and deploy it onto the player. This web app boasts full functionality and is constructed similarly to any other web application. It incorporates HTML and Node.js TypeScript, alongside a simple BrightScript autorun file to configure the player to execute your app.

## Step by Step: 
1. [Set up the project](#development-prerequisites)
2. [Set up your player](#set-up-player)
3. [Familiarize yourself with the project, customize it if wanted](#contained-in-this-folder)
4. [Build your code with webpack](#building-your-code)
5. [Deploy the built code to your player](#deploying-code-to-the-player)

## Development Prerequisites
Node.js and nvm are required for installation, as specified in the README at the root of the repository.

Then initialize for node:
```sh
nvm use 14.17.6
npm install
```

## Contained in this folder

This `template-html5-app` folder contains the code base of the template app, the simple BrightScript autorun, a simple script to deploy code to the player, and the webpack configuration file.

### src

Contained in the ./src folder is the autorun and html/ts code for the webapp. 

The autorun is very simple BrightScript. It simply tells the player to create a chromium instance and run the html file index.html found in ./src. It also enables the diagnostic web server, the web inspector and SSH on the player. The only necessary BrightScript in the autorun is the generation of the html widget. The other features are there as examples of useful things autorun can do. 

The index.html and index.ts files contained in ./src are the files that make up the code for the web app. The autorun plays index.html in the chromium instance, while index.js contains the javascript that dynamically edits index.html, creating a web app. Development of your web app will be done by editing these two files. 

The index.ts TypeScript file uses BrightSign's javascript API to interact with the player. Documentation on this API can be found [here](https://brightsign.atlassian.net/wiki/spaces/DOC/pages/370678188/JavaScript+API). This template web app uses the DeviceInfo API to retrieve information about the device running the app. Please note that every JS API interacted with must be defined as an external package in [webpack.config.js](#webpack-config). 

**[Use BrightSign's Player CLI](#brightsign-player-cli) to push files.**

### Webpack Config

Webpack is an npm module that compiles all your javascript files into a single one (including packages), allowing for easier deployment of complex code to the player. More information on Webpack can be found in the **Deploying to the Player** section of this document. The configuration file tells webpack which files to compile and where the output will go, along with which external packages you are using. Any BrightSign JS API used will need to be defined in the 'externals' section of the config file, specifically found on line 40:
```JavaScript
externals: {
  '@brightsign/deviceinfo': 'commonjs @brightsign/deviceinfo'
},
```
If you are using the audiooutput module, you would need to add this line:
```JavaScript
externals: {
  '@brightsign/deviceinfo': 'commonjs @brightsign/deviceinfo',
  '@brightsign/audiooutput': '@brightsign/audiooutput'
},
```

[Back to Step by Step](#step-by-step)

## Set up Player
In order to transfer files to the player over the local network the local Diagnostic Web Server (DWS) must be enabled on the player. This is done by default in the autorun file stored here. It's also useful to have the serial console enabled on the player (Note: some players do not have a serial port. In this case, logs can be found on the DWS server and the player can be talked to over SSH/Telnet). 

### Enabling Serial
You will need the appropriate serial cable to connect to your player as well as software to read the output. On Linux and Mac the "screen" bash command is incredibly useful. If your serial cable is connected to USB0 on your computer, run:
```sh
sudo screen /dev/ttyUSB0 115200
```

If you want dedicated software to read serial input on your computer, [PuTTY](https://pbxbook.com/voip/sputty.html) works great. 

In order to enable serial on the player, take the SD card out of the player and power it on with the SVC button pressed. When the following log output is seen,

`Automatic startup in 3 seconds, press Ctrl-C to interrupt.`

release the SVC button and press Ctrl-C. In the prompt that comes up type:
```sh
console on
reboot
```

### Enabling Debug

Reboot the player and you will see logs on serial session. Press the SVC button (while the SD card is *not* inserted) and it will drop you to a BrightSign prompt.  Type:

```sh
script debug on
registry write html enable_web_inspector 1
```

### Disabling Control Cloud

If you want to avoid the player interacting with BSN.cloud while you are developing, you can put the player totally in local mode with this:

```sh
registry write networking bsnce false
```

[Back to Step by Step](#step-by-step)

## Building your Code

BrightSign recommends using webpack to actually build your web app. Webpack will combine all javascript code (including libraries) into a single file. This is necessary for JavaScript to run on the player. For more information on webpack, refer to their [documentation](https://webpack.js.org/concepts/).

### Build commands
You can choose to compile the code in either development or production mode.

To compile the code in development mode, run:
```sh
npm run build:dev
```

To compile the code in production mode, run:
or production mode:
```sh
npm run build:prod
```

### Run as a Mock Desktop Client
The project also supports running as a mock desktop client. To start the mock client, run:
```sh
npm start
```

[Back to Step by Step](#step-by-step)

## Deploying Code to the Player

Before you actually deploy code to the player, you must build the web app. BrightSign recommends using webpack to condense your code into a single JS file. See [building your code](#building-your-code) for more info. Webpack will build into a `dist/` directory. The entire dist directory needs to be put on the player (within a `dist/` directory on the SD card), as well as the autorun and any additional media files you include in your app.

There are multiple options to deploy code to a player on your local network, the two main ones being:
1. [Manually put files on the SD card (or SSD)](#using-the-sd-card)
2. [Use the supervisor API's](#using-the-supervisor-apis)

### Using the SD Card

This method of code deployment is simple but very slow. It requires taking the SD card out of the player, putting it into your computer, putting the required files onto the SD card, and putting the SD card back into the player. Then, you have to run the code ([Restart the app on the player](#restarting-the-app-on-the-player)). 


### Using the Supervisor APIs

There are multiple ways to interact with the supervisor API's:
1. [Use BrightSign's Player CLI](#brightsign-player-cli)
2. [Use BrightSign's provided bash scripts](#provided-bash-scripts)
3. [Use the local DWS front end](#local-dws-front-end)
4. [Build your own deployment pipeline](#building-your-own-deployment-pipeline)

#### BrightSign Player CLI

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

[Back to deployment options](#deploying-code-to-the-player)

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

To actually put code on your player:
```sh
npm run cp
```

If you are confident the code will compile with webpack, you can combine building the app and deploying the app with:
```sh
npm run put
```

Or to deploy the development version of your code:
```sh
npm run put:dev
```

[Back to deployment options](#deploying-code-to-the-player)

#### Local DWS front end

Access the local DWS by typing the IP address of your player into a web browser. From there, you can view, upload and delete files on the player from the 'SD' tab. 

For more information on the local DWS, refer to BrightSign's [DWS Documentation](https://brightsign.atlassian.net/wiki/spaces/DOC/pages/370673541/Diagnostic+Web+Server)

[Back to deployment options](#deploying-code-to-the-player)

[Back to Step by Step](#step-by-step)