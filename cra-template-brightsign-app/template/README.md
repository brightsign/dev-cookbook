## Intro
This sample shows how you can run a simple Node.js service that hosts an API and a React frontend on the same port. You can update the displayed text using the `/text` endpoint.

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

You can check for `console.log` messages in your device log file.

1. Find your device in BrightAuthor: Connected and click the gear icon. 
2. Go to the "LOG" tab and click "Download Log"

Search for a string like the following:

`[   12.858] [INFO]   [source file:///sd:/dist/bundle.js:2]: console log message...`

### Building on M1 
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