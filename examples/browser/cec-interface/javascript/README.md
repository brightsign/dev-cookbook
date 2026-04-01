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

## Troubleshooting

A common error that you may see when using CEC is the 133 error which indicates "destination address not acknowledged" or in plainer English "the device you are trying to talk to is not listening":
```
{  238.703} [INFO]   [source file:///sd:/index.html:52]: Error while sending CEC command: {"error":133}
```

To resolve this:
- Ensure that your BrightSign device is connected to a CEC-compatible display via HDMI.
- Make sure that CEC is enabled on your display device.
- Try replacing the HDMI cable if CEC commands are still not being received.
- Try running your code on a different display device to rule out compatibility issues.

## Reference
- [BrightSign @brightsign/cec documentation](https://docs.brightsign.biz/developers/cec)
