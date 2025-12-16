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
- [BrightSign roCecInterface documentation](https://docs.brightsign.biz/developers/rocecinterface)
