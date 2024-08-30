
# Starter Node.js HTTP Server on BrightSign Device

## Introduction

This example is the second stepping stone of the starter examples to get familiar with developing with a BrightSign. The intention of this example is to show how to get a simple node application running on your player. Once the server is running, you’ll be able to access a congratulatory message by making a request to the server's `/` endpoint.

The node application is defined in `index.js` and is a simplified version of the html templates we offer. In addition to the JavaScript file, there is an `autorun.brs` file which is what tells your player to run the application.

## Prerequisites

1. **Wi-Fi or Ethernet Network**: Both your BrightSign device and the computer should be connected to the same network to fully interact with this example.

## Steps to Set Up and Run the Server

### 1. Prepare the SD Card

1. Insert the SD card into your computer.
2. Since this example is simplified, there are only two files which you will need to copy to the root of the player's sd card. Copy the `index.js` and `autorun.brs` files from this directory to the root of the SD card.

### 2. Set Up the BrightSign Device

1. Eject the SD card from your computer and insert it into your BrightSign device.
2. Power on the BrightSign device and allow it to boot up.
3. The device will automatically run the `autorun.brs` file which executes the `index.js` node server.

### 3. Accessing the Server

Once the device has booted and the server has started:

1. **Find the IP Address**:
   - Identify the IP address of your BrightSign device. This can typically be found in the device's network settings or via BrightAuthor connected.

2. **Interact with the Server**:
   - Open a terminal or command prompt on your computer.
   - Use the `curl` command to make a request to the server's `/` endpoint:
     ```bash
     curl http://<device-ip>:3000/
     ```
     Replace `<device-ip>` with the actual IP address of your BrightSign device.

   - Alternatively, you can open a web browser and navigate to:
     ```
     http://<device-ip>:3000/
     ```

3. **Expected Response**:
   - If the server is running correctly, you should see the following message in your terminal or browser:
     ```
     Congratulations on interacting with your BrightSign running a simple node http application!
     ```

### 4. Troubleshooting

- **No Response**: If you don't receive a response from the server, verify that:
  - The BrightSign device is properly connected to the network.
  - The IP address is correct.
  - The server script is correctly copied to the SD card.
  - The device allows incoming connections on port `3000`.
