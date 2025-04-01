# Bluetooth scan example on BrightSign players

## Introduction

The intention of this example is to show how to get a Bluetooth scanning application (HTML+JS) running on your BrightSign player.

The application is defined in `index.html` which also includes a `script` section for the JavaScript bits. There is an `autorun.brs` file which tells the player to run the application.

Note that this example cannot be ran on a browser as it uses BrightSign's proprietary JavaScript API.

## Prerequisites

1. **Bluetooth adapter**: The BrightSign player should have a Bluetooth adapter to scan for nearby devices. See [this page](https://www.brightsign.biz/wp-content/uploads/2023/04/Wifi-Modules-Bluetooth-Datasheet.pdf) for more information on BrightSign Wi-Fi and Bluetooth modules.

2. [optional] **Wi-Fi or Ethernet Network**: ONLY applicable if using the [Automated Transfer](#2-automated-transfer-using-brightsign-cli-for-dws) method below. Both your BrightSign player and the computer should be connected to the same Wi-Fi or Ethernet network.

## Steps to Set Up and Run the Application

After the application is ready to be deployed, you need to transfer the required files to your BrightSign player. There are 2 ways of doing this:

### 1. Manual Transfer
1. Copy the `autorun.brs` and `index.html` files at the root of the SD card.
2. Insert the SD card into the player.
3. Reboot the player.

### 2. Automated Transfer Using BrightSign CLI for DWS
BrightSign's player CLI: [player-CLI](https://www.npmjs.com/package/@brightsign/bsc). To deploy this app with the CLI:

Configure the CLI by choosing a name for your player and passing your player's information:

`bsc local player --add --player playerName --ip ip-address --user username --pass password --storage sd`

**Note**: The "username" and "password" are the credentials for the [Local DWS](#3-local-dws-ui) of the BrightSign player.

This is an example command for pushing files to your player:

`bsc local file --upload --player playerName --file ./path-to-your-file --destination sd/path-on-player`

### 3. Local DWS UI
To access the Local DWS, go to the IP address of your player in a web browser. The default username is `"admin"` and the password is the player serial number.

**Note**: If you don't know the IP address of the player, you can boot up the player WITHOUT an SD card, and after a few seconds, the splash screen will display it, along with the player's serial number and OS version.

1. Once logged in to the DWS, go to the `SD` tab.
2. Click on the `Browse` button in the `Upload Files` section.
3. Select the `autorun.brs` and `index.html` files from your computer.
4. Click on the `Upload` button to transfer the files to the player.
5. Once the files are uploaded, you can reboot the player to run the application.
6. You can also reboot the player using the `Reboot` button under the `Control` tab.

## Troubleshooting

- **No HTML content**: If you don't see anything on the display attached to the player, verify that:
  - The BrightSign player is connected to a display via an HDMI cable.
  - The required files are correctly copied to the root of the SD card.

- **Bluetooth scanning not working**: If the Bluetooth scanning is not working, verify that:
  - The BrightSign player has a Bluetooth adapter attached.
  - The player is at least on OS v9.0.199.

In order to troubleshoot any issues, it is recommended to use the BrightSign Shell. The shell can be accessed by connecting a serial cable to the BrightSign player and using a terminal emulator (e.g. PuTTY) to connect to the player. More details can be found [here](https://docs.brightsign.biz/space/DOC/1988100153/BrightSign+Shell). 

If a serial cable is not available, you can make use of [telnet or SSH](https://docs.brightsign.biz/space/DOC/370673607/Telnet+and+SSH) as well.