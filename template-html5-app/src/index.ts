import { displayCurrentNetwork, displayDeviceInfo } from "./info";
import { getConfig } from "./config";

const config = getConfig();

const start = async () => {
    console.log(
        `config.env: desktop mode - ${config.isDesktop}, environment - ${config.nodeEnv}`
    );

    if (!config.isDesktop) {
        displayCurrentNetwork();
        await displayDeviceInfo();
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
