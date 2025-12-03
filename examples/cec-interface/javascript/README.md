# JavaScript CEC Example

This example demonstrates how to send and receive CEC (Consumer Electronics Control) commands using JavaScript on BrightSign devices.

## What it does
- Uses the `@brightsign/cec` package to send CEC commands
- Listens for CEC receive events
- Sends an "Image View On" (display on) command, waits 15 seconds, then sends a "Standby" (display off) command

## How to use
1. Copy the `autorun.brs`, `index.html` and `index.js` files to the root of the SD card of your BrightSign player.
2. Reboot the player.
3. The script will automatically run and send the CEC commands as described.

## Reference
- [BrightSign @brightsign/cec documentation](https://docs.brightsign.biz/developers/cec)
