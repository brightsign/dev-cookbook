# BrightScript CEC Example

This example demonstrates how to send CEC (Consumer Electronics Control) commands using BrightScript on BrightSign devices.

## What it does
- Sends an "Image View On" (display on) CEC command
- Waits 15 seconds
- Sends a "Standby" (display off) CEC command

## How to use
1. Copy the `autorun.brs` and `index.html` files to the root of the SD card of your BrightSign player.
2. Reboot the player.
3. The script will automatically run and send the CEC commands as described.

## Reference
- [BrightSign roCecInterface documentation](https://docs.brightsign.biz/developers/rocecinterface)
