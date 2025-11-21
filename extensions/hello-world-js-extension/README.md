# Hello World JS Extension

This guide explains how to create a dev BrightSign extension from a JavaScript application using the provided scripts in this project.

## Project Structure

- `src/index.js`: Main JavaScript application. Sends a UDP message over a configurable port with device info periodically after a 60-second startup delay (also configurable).
- `player-app/*`: Example UDP listener for testing extension output.
- `sh/bsext_init`: Init script to start/stop the extension on the device.
- `sh/make-extension-lvm` and `sh/make-extension-ubi`: Scripts to package the extension for LVM or UBI volumes.
- `sh/pkg-dev.sh`: Main packaging script. Calls the appropriate packaging script and zips the output.
- `webpack.config.js`: Bundles the JS app and copies the init script.
- `package.json`: Project metadata and build scripts.

## How the Extension Works

- The JS app (`src/index.js`) waits for BrightSign JS APIs to load, then sends a UDP message every few seconds (configurable) with device info and timestamp.
- The init script (`sh/bsext_init`) launches the JS app, passing the UDP port as an environment variable.
- Packaging scripts create a SquashFS image and install scripts for deployment.

## Creating a Dev Extension from a JS App

### 1. Prepare Your JS Application
- Place your main JS file in `src/index.js`.
- Ensure it uses environment variables for configuration (e.g., `PORT`).
- Edit the timeout values at the top of the file as needed.

### 2. Build the Application
- If you don't have `yarn` installed, you can install it globally using `npm`:
    ```bash
    npm install -g yarn
    ```
- Then navigate to the extension directory:
    ```bash
    cd extensions/hello-world-js-extension
    ```
- Run `yarn install` to install dependencies.
- Run `yarn build` to bundle the JS app (output in `dist/`).

### 3. Package the Extension

- Make sure to edit the name of the extension in all the scripts (`bsext_init`, `make-extension-lvm` and `make-extension-ubi`). They should all match.

- Use the packaging script to create a deployable zip:
  ```bash
  cd extensions/hello-world-js-extension
  bash sh/pkg-dev.sh dist lvm
  # or for UBI volume
  bash sh/pkg-dev.sh dist ubi
  ```
- This creates a zip file (e.g., `hello_world-<timestamp>.zip`) containing the packaged extension.

### 4. Deploy to Device
- Copy the zip file to the root of the SD card on your BrightSign player.

### 5. Run the extension on the player

#### Pre-Requisites
   
1. Un-secure the Player -- [Guide](https://github.com/brightsign/extension-template/blob/main/spells/Un-Secure-Player.md)
    - BrightSign Players are secured by default and can only run software that has been verified and signed by BrightSign so as to maintain the security of HDCP and other keys as well as to maintain reliability of the players.
    - However for development purposes, the player can be un-secured so that it can run unsigned dev extensions.
    - See the guide above for steps on how to do this.
    - Note that this should only be done on development devices for testing the extension.

2. You can do one of 2 things:
   1. Connect the dev player to your PC over Serial -- [Serial-Connection](https://github.com/brightsign/extension-template/blob/main/spells/Serial-Connection.md)

        OR

   2. Enable Telnet / SSH on the dev player -- [Guide](https://docs.brightsign.biz/advanced/telnet-and-ssh)

3. You should also add the following registry entry in the same script that enables Telnet/SSH:
    ```
    brightscriptReg = CreateObject("roRegistrySection", "brightscript")
    brightscriptReg.write("debug","1")
    brightscriptReg.flush()
    ```

4. Ensure that the player is rebooted after making these changes.

#### Running the Extension

Once all the pre-requisites are met, follow these steps:

1. Connect to the player via Serial connection or Telnet/SSH.
2. Once booted up, either press the `SVC` button on the player and type `Ctrl+C` to enter the BrightSign Debugger. Note that this will not work without the `brightscript -> debug` registry entry set.
3. Type `exit` to break into the `BrightSign>` prompt.
4. Type `exit` here again.
5. This time you should be in the Linux shell `#` of the BrightSign player. This will not work if the player is still secure.
6. Once in the Linux shell, follow the steps below to run the extension:
    ```sh
    # in the player Linux shell
    cd /usr/local
    
    # clean up any leftovers
    #rm -rf *

    export latest=$(ls -t /storage/sd/hello_world-*.zip | head -n 1)
    unzip ${latest} -o -d /usr/local/

    # install the extension
    bash ./ext_hello_world_install-lvm.sh

    # the extension will be installed on reboot
    reboot
    ```
7. After reboot, the extension should start automatically.

### 6. Testing the Extension
- Copy the `autorun.brs` and `listener.js` files from `player-app` folder to the root of the SD card.
- Reboot the player.
- You should start seeing UDP messages from the extension printed in the serial log.

## Uninstall the extension

A hard factory reset (Hold SVC + Reset buttons) is the recommended way to uninstall any extensions and return the player to a known state. Consult this [Documentation page](https://docs.brightsign.biz/how-tos/factory-reset-a-player#Vw6D_) for instructions on how to perform a factory reset.

Alternatively, you can manually uninstall the extension by following these steps:

1. Connect to the player over Telnet/SSH and drop to the Linux shell.
2. STOP the extension -- e.g. `/var/volatile/bsext/ext_hello_world/bsext_init stop`
3. VERIFY all the processes for your extension have stopped.
4. Unmount the extension filesystem and remove it from BOTH the `/var/volatile` filesystem AND the `/dev/mapper` filesystem.

Following the outline given by the `make-extension` script.

```sh
# stop the extension
/var/volatile/bsext/ext_hello_world/bsext_init stop

# check that all the processes are stopped
# ps | grep ext_hello_world

# unmount the extension
umount /var/volatile/bsext/ext_hello_world
# remove the extension
rm -rf /var/volatile/bsext/ext_hello_world

# remove the extension from the system
lvremove --yes /dev/mapper/bsos-ext_hello_world
rm -rf /dev/mapper/bsos-ext_hello_world

reboot
```

If you have any issues during the manual uninstall, use the factory reset method mentioned above.

## Scripts Explained

- `bsext_init`: Handles starting/stopping the Node.js app, sets up environment variables, and manages process lifecycle.
- `make-extension-lvm / make-extension-ubi`: Packages the extension for different volume types, creates SquashFS images, and install scripts.
- `pkg-dev.sh`: Main entry point for packaging. Calls the correct packaging script and zips the output.

## Important Notes
- The extension name must match across scripts for correct packaging and deployment.
- Modify timeouts and other constants in `src/index.js` as needed for your application.

## Next Steps

### Submit Extension for Signing

Contact your Partner Engineer for information about submitting your extension for signing. Once signed, the extension will be returned to you as a `.bsfw` file that can be applied to a production (secure) player by copying the file to the SD card.  The extension will be installed on reboot.

---

For more details, see comments in each script and the source files.

For more information on extensions, see the [extension-template](https://github.com/brightsign/extension-template) repo.