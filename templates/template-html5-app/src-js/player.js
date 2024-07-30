import { getConfig } from "./config";

const config = getConfig();

const initializePlayer = async () => {
    console.log("initializePlayer()");

    return {
        DeviceInfo: (await import("@brightsign/deviceinfo")).default,
        RegistryClass: (await import("@brightsign/registry")).default,
    };
};

const initializeDesktop = async () => {
    console.log("initializeDesktop()");

    return {
        DeviceInfo: (await import("./device-info")).default,
        mockPlayer: (await import("./__mocks__/@brightsign/raptor")).info,
    };
};

export async function bsPlayer() {
    const player = {};

    if (config.isDesktop) {
        const playerModule = await initializeDesktop();
        player.BSDeviceInfo = new playerModule.DeviceInfo(
            playerModule.mockPlayer
        );
    } else {
        const playerModule = await initializePlayer();
        player.BSDeviceInfo = new playerModule.DeviceInfo();
        player.registry = new playerModule.RegistryClass();
    }
    return player;
}
