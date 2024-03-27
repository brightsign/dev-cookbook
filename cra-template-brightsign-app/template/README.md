## Intro

This sample shows how you can run a simple Node.js service that hosts an API and a React frontend on the same port. You can update the displayed text using the `/text` endpoint.

## How it works

The app builds two bundles via Webpack: `frontend.js` and `backend.js`.

-   `backend.js` runs an Express server that serves `index.html` and other static files as well as any API endpoints that you wish to build. This is built from the code in `src/server/index.js`.
-   `frontend.js` is built from `src/index.js` and contains all the React dependencies and code. `index.html` loads it from the statically hosted files.

When the project is built, generated code is placed in the `/dist` directory. This code and everything in the `public` directory needs to be pushed to the device at `/sd/dist` and run by the `autorun.brs` script.

## Using the sample

To deploy your code, you will need the device to be configured for DWS access, the device's IP address, and its serial number. Simply navigate to the root of the directory and run the following command to push the code and restart the device.

```
PLAYER=your.device.ip.address PLAYER_PW=XCG31D001234 npm run put:prod
```

Updating the header text

```
curl -d '{"text": "hello world" }' -H 'Content-Type: application/json' -X POST your.device.ip.address:8020/text
```

## How to check for logs

Using the BrightSign CLI:

```
bsc getlogs playerName | grep "my message" | tail
```

If you are not using the BrightSign CLI, you can check for `console.log` messages in your device log file.

1. Find your device in BrightAuthor: Connected and click the gear icon.
2. Go to the "LOG" tab and click "Download Log"

Search for a string like the following:

`[   12.858] [INFO]   [source file:///sd:/dist/bundle.js:2]: console log message...`

You can also use SSH to access the device and view log messages in realtime.

### Building on Mac M1

You might see an error like `npm ERR! Error: Cannot find module 'node-bin-darwin-arm64/package.json'`

Run the following commands

```
> node -v
v14.17.6
> node -p process.arch
arm64
> arch -x86_64 zsh
> nvm remove 14.17.6 && nvm install 14.17.6
```

You might need to do this each time you restart your terminal.

https://stackoverflow.com/questions/68896696/having-trouble-installing-npm-on-mac-m1
