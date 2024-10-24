# Examples

Welcome to the examples directory! This guide will help you get started with the provided examples and guide you through the progression from basic HTML to more advanced Node.js applications and then introduce templates.

## Getting Started

### 1. Starter HTML Example

Begin your journey with the `html-starter-example`. This example provides a simple HTML setup to help you understand the basics of web development.

- **Location**: `examples/html-starter-example`
- **Instructions**: Follow the specific instructions provided in the example's README file.

### 2. Starter Node Example

Once you are comfortable with HTML, move on to the `node-starter-example`. This example introduces you to Node.js and Express, allowing you to create a basic server.

- **Location**: `examples/node-starter-example`
- **Instructions**: Follow the specific instructions provided in the example's README file.

### 3. Node Simple Server Example

After running through the basics with the `starter-node-example`, you can delve deeper into server-side development with the `node-simple-server-example`. This example provides a more detailed look at creating a simple server using Node.js and Express, including handling routes and middleware.

- **Location**: `examples/node-simple-server-example`
- **Instructions**: Follow the specific instructions provided in the example's README file.


### 4. Templates

After getting familiar the basics of HTML and Node.js, you can explore the templates in the `templates` directory. These templates provide more advanced setups depending on the type of application you plan to create.

- **Location**: `templates`
- **Instructions**: Choose a template that fits your application needs and follow the specific instructions provided in the template's README file.

### 5. Other Examples

Other examples in this directory intend to offer more specific references for applications. Once you get your bearing with starter examples, more tools and specific use cases will be offered. For example, applications will include tests, mocks, webpack configurations, scripts to push code to your player seamlessly, and more. 

## Conclusion

By following this progression, you will build a solid foundation in development with a BrightSign player, starting from basic HTML, moving to server-side development with Node.js, and finally exploring more advanced templates for specific applications.









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
   - Identify the IP address of your BrightSign device. This can typically be found in the device's network settings or via BrightAuthor:connected or by booting the player without the Micro SD card inserted.

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
