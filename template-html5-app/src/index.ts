import { displayCurrentNetwork, displayDeviceInfo } from "./info";
import { getConfig } from "./config";
import express from "express";
import path from "path";
const spawn = require("child_process").spawn;

const app = express();
const port = 9000;
const config = getConfig();

const start = async () => {
    console.log(
        `config.env: desktop mode - ${config.isDesktop}, environment - ${config.nodeEnv}`
    );

    if (!config.isDesktop) {
        displayCurrentNetwork();
        await displayDeviceInfo();
    } else {
        // open default browser
        app.use(express.static(path.join(__dirname)));
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
        });
        spawn("open", [`http://localhost:${port}/`]);
    }
};

declare global {
    interface Window {
        main: () => void;
    }
}

if (config.isDesktop) {
    start();
} else {
    window.main = start;
}
