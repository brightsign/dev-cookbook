import os from "os";

import { DeviceInfo } from "./device-info";
import { bsPlayer, BrightSignPlayer } from "./player";

const displayCurrentNetwork = () => {
    const networkInterfaces = os.networkInterfaces() || {};
    let ipAddress = "";

    Object.keys(networkInterfaces).forEach((interfaceName) => {
        networkInterfaces[interfaceName]?.forEach((interfaceInfo) => {
            if (interfaceInfo.family === "IPv4") {
                ipAddress += `${interfaceName}: ${interfaceInfo.address} `;
                console.log(
                    `Network Interface - ${interfaceName}: ${interfaceInfo.address}`
                );
            }
        });
    });

    document.querySelector("#ipAddress .value").textContent = ipAddress;
};

const displayDeviceInfo = async () => {
    const player = await bsPlayer();
    const deviceInfo = player.BSDeviceInfo;
    const { model, osVersion, serialNumber } = deviceInfo;

    document.querySelector("#model .value").textContent = model;
    document.querySelector("#osVersion .value").textContent = osVersion;
    document.querySelector("#serialNumber .value").textContent = serialNumber;

    console.log(
        `DeviceInfo - Model: ${model}, OS Version: ${osVersion}, Serial Number: ${serialNumber}`
    );
};

export { displayCurrentNetwork, displayDeviceInfo };
