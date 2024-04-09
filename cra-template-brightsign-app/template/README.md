## Intro

This sample shows how you can run a simple Node.js service that hosts an API and a React frontend on the same port. You can update the displayed text using the `/text` endpoint.

## How it works

The app builds two bundles via Webpack: `frontend.js` and `backend.js`.

-   `backend.js` runs an Express server that serves `index.html` and other static files as well as any API endpoints that you wish to build. This is built from the code in `src/server/index.js`.
-   `frontend.js` is built from `src/index.js` and contains all the React dependencies and code. `index.html` loads it from the statically hosted files.

When the project is built, generated code is placed in the `/dist` directory. This code and everything in the `public` directory needs to be pushed to the device at `/sd/dist` and run by the `autorun.brs` script.

## Using the sample

You can run the React app locally using mocked device data with `yarn start`. Once the code is pushed to the device it will use the built-in @brightsign modules for real data.

To deploy your code, you will need the device to be configured for DWS access, the device's IP address, and its serial number. Simply navigate to the root of the directory and run the following command to push the code and restart the device.

```
PLAYER=your.device.ip.address PLAYER_PW=XCG31D001234 npm run put:prod
```

Updating the header text

```
curl -d '{"text": "hello world" }' -H 'Content-Type: application/json' -X POST your.device.ip.address:8020/text
```

## Debugging

To debug your web application you can enable the`Inspector Server` allowing the Chrome DevTools to connect over the local network. See the *Debugging Webpages* section in [HTML Best Practices](https://brightsign.atlassian.net/wiki/x/ngIYFg) for more info.

## Bundling

For most use cases, leveraging a bundling tool like [webpack](https://webpack.js.org/) is recommended to minimize the dependency graph from one or more entry points and many modules, into either 1 or a few entry points.

## Deployment for Local Development

There are many means of deploying software to a BrightSign player. Common methods include:

1. Push your software to the Local Diagnostic Web Server (DWS) either through the Local DWS UI or a REST Client Tool.
   1. The `~/scripts/put` shell script could be leveraged.
   2. Coming soon: Improved tooling to push software to the Player independent of BrightAuthor:connected

## Deploy through an Authoring Application

1. Leverage a CMS to run HTML, CSS, JS and / or Node.js managing the application as content running.
2. Author a BrightAuthor:connected Presentation to load your local application(s).

HTML 5 Widget in a Presentation loads locally provided .html file. The .html file is the entry file for HTML, CSS, JavaScript. To execute within the Node.js runtime, the *Enable Node.js*.

A Node.js Zone in a Presentation is used to execute within the Node.js runtime when the entry file is JavaScript.

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
