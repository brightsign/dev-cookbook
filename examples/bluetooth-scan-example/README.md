# Bluetooth scan example on BrightSign players

## Introduction

The intention of this example is to show how to get a Bluetooth scanning application (HTML+JS) running on your BrightSign player.

The application is defined in `index.html` which also includes a `script` section for the JavaScript bits. There is an `autorun.brs` file which tells the player to run the application.

Note that this example cannot be ran on a browser as it uses BrightSign's proprietary JavaScript API.

## Prerequisites

1. **Wi-Fi or Ethernet Network**: Both your BrightSign device and the computer should be connected to the same network to fully interact with this example.

2. **Bluetooth adapter**: The BrightSign device should have a Bluetooth adapter to scan for nearby devices. See [this page](https://www.brightsign.biz/wp-content/uploads/2023/04/Wifi-Modules-Bluetooth-Datasheet.pdf) for more information on BrightSign Wi-Fi and Bluetooth modules.

## Steps to Set Up and Run the Application

### 1. Prepare the SD Card

1. Insert the SD card into your computer.
2. Copy the `index.html` and `autorun.brs` files from this directory to the root of the SD card.

### 2. Set Up the BrightSign Device

1. Eject the SD card from your computer and insert it into your BrightSign device.
2. Power on the BrightSign device and allow it to boot up.
3. The device will automatically run the `autorun.brs` script which loads the `index.html` file inside an HTML widget.

## Troubleshooting

- **No HTML content**: If you don't see anything on the display attached to the player, verify that:
  - The BrightSign player is connected to a display via an HDMI cable.
  - The required files are correctly copied to the root of the SD card.

- **Bluetooth scanning not working**: If the Bluetooth scanning is not working, verify that:
  - The BrightSign device has a Bluetooth adapter attached.
  - The player is at least on OS v9.0.199.

In order to troubleshoot any issues, it is recommended to use the BrightSign Shell. The shell can be accessed by connecting a serial cable to the BrightSign player and using a terminal emulator (e.g. PuTTY) to connect to the player. More details can be found [here](https://docs.brightsign.biz/space/DOC/1988100153/BrightSign+Shell).