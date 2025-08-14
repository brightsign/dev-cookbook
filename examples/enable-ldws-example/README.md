# Enable Local Diagnostic Web Server (LDWS) Example

## Introduction

This example demonstrates three different methods to enable and configure the Local Diagnostic Web Server (LDWS) on a BrightSign device. The LDWS provides a web interface for device diagnostics, monitoring, and configuration that can be accessed from a web browser on the same network.

## Overview


The example showcases three different approaches, listed in order of recommendation:
1. **BrightScript Method** (recommended for most applications) — Using `roNetworkConfiguration` in `autorun.brs` at the root of this directory
2. **Node.js Method** (recommended for Node.js-based projects) — Using the `@brightsign/dwsconfiguration` module in the `javascript/` subdirectory
3. **Registry Method** (lowest priority, not recommended unless required) — Using direct registry settings in the `registry-config/` subdirectory


## Directory and Files

- `autorun.brs` — BrightScript application (recommended): enables LDWS using `roNetworkConfiguration`.
- `javascript/`
  - `autorun.brs` — BrightScript autorun file to launch the Node.js example.
  - `index.js` — Node.js application: enables LDWS using the `@brightsign/dwsconfiguration` module.
- `registry-config/`
  - `autorun.brs` — BrightScript application: enables LDWS by writing directly to the registry (lowest priority method).


## Method 1: BrightScript with roNetworkConfiguration (**Recommended**)

**File:** `autorun.brs` (in this directory)

This method uses the `roNetworkConfiguration` object's `SetupDWS()` function to configure the LDWS settings.

**Features:**
- Direct API approach using BrightScript
- Automatic reboot handling when required
- Password protection with custom password
- Immediate configuration application

**How it works:**
1. Creates a `roNetworkConfiguration` object
2. Defines DWS configuration with password
3. Applies configuration using `SetupDWS()`
4. Automatically reboots the device if required

### Configuration Options:
- `open`: Sets the password for LDWS access
- The function returns `true` if a reboot is required to apply changes


## Method 2: Node.js with @brightsign/dwsconfiguration Module

**Files:** `javascript/autorun.brs` and `javascript/index.js`

This method uses the Node.js `@brightsign/dwsconfiguration` module to configure LDWS settings. The BrightScript `autorun.brs` in the `javascript/` folder launches the Node.js script.

**Features:**
- Modern Node.js API approach
- Detailed configuration options
- Support for multiple authentication methods
- Flexible password obfuscation options

**How it works:**
1. Imports the `@brightsign/dwsconfiguration` module
2. Creates a new DWSConfiguration instance
3. Defines comprehensive configuration object
4. Applies configuration using `applyConfig()`

### Configuration Options:
- `port`: HTTP port for the web server (default: 80)
- `password.value`: Password for accessing the web interface
- `password.obfuscated`: Whether the password is obfuscated (false = plain text)
- `authenticationList`: Array of supported authentication methods (e.g., ["basic"])


## Method 3: Registry Settings (**Not recommended unless required**)

**File:** `registry-config/autorun.brs`

This method uses the BrightSign registry to configure LDWS settings. It is the least preferred method and should only be used if the other two are not possible.

**Features:**
- Low-level configuration approach
- Direct registry manipulation
- Persistent settings storage
- Requires manual reboot or restart

**How it works:**
1. Creates a `roRegistrySection` for "networking"
2. Writes the HTTP server port configuration
3. Flushes changes to persistent storage

### Configuration Options:
- `http_server`: Sets the port number for the HTTP server

## Running the Examples


### Method 1 (BrightScript - Recommended)
1. Copy `autorun.brs` (from this directory) to the root of your BrightSign player's SD card.
2. Power on or restart your BrightSign player.
3. The device will automatically configure LDWS and reboot if necessary.
4. Access the web interface at `http://<device-ip>/` with your configured password.

### Method 2 (Node.js)
1. Ensure your BrightSign player supports Node.js applications.
2. Copy both `javascript/autorun.brs` and `javascript/index.js` to the root of your BrightSign player's SD card.
3. Power on or restart your BrightSign player.
4. Access the web interface at `http://<device-ip>/` with your configured password.

### Method 3 (Registry - Not recommended)
1. Copy `registry-config/autorun.brs` to the root of your BrightSign player's SD card.
2. Power on or restart your BrightSign player.
3. Manually restart the device or network service for changes to take effect.
4. Access the web interface at `http://<device-ip>:80/`.

## Accessing the LDWS Web Interface

Once LDWS is enabled:

1. **Find the Device IP Address:**
   - Check your router's connected devices
   - Use BrightAuthor:connected device discovery
   - Boot the player without an SD card to see network information

2. **Access the Web Interface:**
   - Open a web browser on a device connected to the same network
   - Navigate to `http://<device-ip>/` (or `http://<device-ip>:80/` for Method 3)
   - Enter the configured password when prompted

3. **Available Features:**
   - Device diagnostics and system information
   - Network configuration and status
   - Log file access and download
   - System monitoring and performance metrics

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

## Best Practices

1. **Use Method 1 (BrightScript)** for most BrightScript-based applications
2. **Use Method 2 (Node.js)** when developing Node.js applications
3. **Use strong passwords** and change them regularly
4. **Document the LDWS password** for future reference
5. **Test access** after configuration to ensure it works correctly
6. **Disable LDWS** in production if not needed for ongoing maintenance

This example provides a foundation for implementing LDWS configuration in your BrightSign applications using the method that best fits your development approach.
