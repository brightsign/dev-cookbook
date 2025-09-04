# Enable Local Diagnostic Web Server (LDWS) Example

## Introduction

This example demonstrates three different methods to enable and configure the Local Diagnostic Web Server (LDWS) on a BrightSign device. The LDWS provides a web interface for device diagnostics, monitoring, and configuration that can be accessed from a web browser on the same network.

## Overview and Directory Structure

This example showcases three different approaches to enabling and configuring the Local Diagnostic Web Server (LDWS) on a BrightSign device, listed in order of recommendation:

- **BrightScript Method** (recommended for most applications):
  - `autorun.brs` — BrightScript application at the root of this directory. Enables LDWS using `roNetworkConfiguration`.

- **Node.js Method** (recommended for Node.js-based projects):
  - `javascript/autorun.brs` — BrightScript autorun file to launch the Node.js example.
  - `javascript/index.js` — Node.js application that enables LDWS using the `@brightsign/dwsconfiguration` module.

- **Registry Method** (lowest priority, not recommended unless required):
  - `registry-config/autorun.brs` — BrightScript application that enables LDWS by writing directly to the registry.

## Method 1: BrightScript with roNetworkConfiguration (**Recommended**)

**File:** `autorun.brs` (in this directory)

This method uses the `roNetworkConfiguration` object's `SetupDWS()` function to configure the LDWS settings.

**How it works & Features:**
- Uses the BrightScript `roNetworkConfiguration` API to enable LDWS with a custom password
- Applies configuration immediately and reboots the device if required
- Automatically retrieves and displays the device's IP address in the console output

### Configuration Options:
- `open`: Sets the password for LDWS access
- `port`: Sets the HTTP port for the web server (default: 80)
- The function returns `true` if a reboot is required to apply changes

## Method 2: Node.js with @brightsign/dwsconfiguration Module

**Files:** `javascript/autorun.brs` and `javascript/index.js`

This method uses the Node.js `@brightsign/dwsconfiguration` module to configure LDWS settings. The BrightScript `autorun.brs` in the `javascript/` folder launches the Node.js script.

**How it works:**
- Uses the Node.js `@brightsign/dwsconfiguration` module to enable LDWS with flexible configuration options
- Supports multiple authentication methods and password obfuscation
- Applies configuration programmatically from Node.js using async/await for clean error handling
- Automatically retrieves and displays the device's IP address from the network interface

### Configuration Options:
- `port`: HTTP port for the web server (default: 80)
- `password.value`: Password for accessing the web interface
- `password.obfuscated`: Whether the password is obfuscated (false = plain text)
- `authenticationList`: Array of supported authentication methods (e.g., ["digest"])

## Method 3: Registry Settings (**Not recommended unless required**)

**File:** `registry-config/autorun.brs`

This method uses the BrightSign registry to configure LDWS settings. It is the least preferred method and should only be used if the other two are not possible.

**How it works:**
- Uses direct registry manipulation to enable LDWS
- Settings persist across reboots but require a manual restart to take effect

### Configuration Options:
- `http_server`: Sets the port number for the HTTP server
- `dwse`: Enables the local DWS when disabled from setup package

## Running the Examples

### Method 1 (BrightScript - Recommended)
1. Copy `autorun.brs` (from this directory) to the root of your BrightSign player's SD card.
2. Power on or restart your BrightSign player.
3. The device will automatically configure LDWS and reboot if necessary.
4. Check the console output for the actual device IP address and access the web interface with your configured password.

### Method 2 (Node.js)
1. Ensure your BrightSign player supports Node.js applications.
2. Copy both `javascript/autorun.brs` and `javascript/index.js` to the root of your BrightSign player's SD card.
3. Power on or restart your BrightSign player.
4. Check the console output for the actual device IP address and access the web interface with your configured password.

### Method 3 (Registry - Not recommended)
1. Copy `registry-config/autorun.brs` to the root of your BrightSign player's SD card.
2. Power on or restart your BrightSign player.
3. Manually restart the device or network service for changes to take effect.
4. Access the web interface at `http://<device-ip>:80/`.

## Accessing the LDWS Web Interface

Once LDWS is enabled:

1. **Find the Device IP Address:**
   - **Methods 1 & 2:** Check the console output after running the examples - the actual IP address will be displayed
   - **Alternative methods:** Check your router's connected devices, use BrightAuthor:connected device discovery, or boot the player without an SD card to see network information

2. **Access the Web Interface:**
   - Open a web browser on a computer / laptop connected to the same network  
   - Navigate to `https://<device-ip>/`; by default, the Diagnostic Web Server is enabled on port 80
   - Enter the configured password when prompted

## Security Considerations

- **Change Default Passwords:** Always use strong, unique passwords in production
- **Network Security:** LDWS should only be enabled on trusted networks
- **Access Control:** Consider network-level restrictions to limit access to the web interface
- **Password Protection:** All methods support password protection - use it

## Troubleshooting

- **Cannot Access Web Interface:**
  - Verify the device IP address is correct
  - Ensure your computer and BrightSign device are on the same network
  - Check that the correct port is being used (default: 80)
  - Verify the password is entered correctly

- **Configuration Not Applied:**
  - Method 1: Check if device rebooted after configuration
  - Method 2: Ensure Node.js support is available on the device
  - Method 3: Manually restart the device or network service

- **Port Conflicts:**
  - If port 80 is in use by another application, choose a different port
  - Update your browser URL to include the custom port number

## Important Note: Registry Configuration (`dwse`)

**Note:** The `dwse` registry key is only required for players that have been previously configured with a setup file that explicitly disabled LDWS. This registry setting is NOT needed when LDWS is simply disabled by default on the player. For standard LDWS enablement, use the `SetupDWS()` function (Method 1) or the `@brightsign/dwsconfiguration` module (Method 2) as these are the primary solutions for enabling LDWS functionality.

## Best Practices

1. **Use Method 1 (BrightScript)** for most BrightScript-based applications
2. **Use Method 2 (Node.js)** when developing Node.js applications
3. **Use strong passwords** and change them regularly
4. **Document the LDWS password** for future reference
5. **Test access** after configuration to ensure it works correctly
6. **Disable LDWS** in production if not needed for ongoing maintenance

This example provides a foundation for implementing LDWS configuration in your BrightSign applications using the method that best fits your development approach.
