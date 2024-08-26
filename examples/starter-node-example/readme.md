# Hosting a simple Node.js server on your player

This example shows you how to host a node.js server on your player. In this example, the server serves the device info object from the `@brightsign/deviceinfo` API when a request is made to the player on port `13131`.

## Deployment

Clone this folder to your local dev environment.

1. `npm i`
2. `npm run build`
3. Put `bundle.js` from `dest/` and `autorun.brs` from `src/` onto the root of the player's storage
4. run/restart `autorun.brs`
