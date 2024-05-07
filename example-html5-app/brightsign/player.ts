import { getConfig } from '../config';

const config = getConfig();

const initializePlayer = async () => {
  console.log('initializePlayer()');

  return {
    // @ts-expect-error: Should accept import
    deviceInfo: (await import('@brightsign/deviceinfo')).default,
    // @ts-expect-error: Should accept import
    registryClass: (await import('@brightsign/registry')).default,
  };
};

const initializeDesktop = async () => {
  console.log('initializeDesktop()');

  return {
    deviceInfo: (await import('./device-info')).default,
    mockPlayer: (await import('./device-mock/raptor')).info,
  };
};

export interface BrightSignPlayer {
  BSDeviceInfo: any;
  registry?: any;
}

export async function bsPlayer() {
  const player = <BrightSignPlayer>{};

  if (config.isDesktop) {
    const playerModule = await initializeDesktop();
    player.BSDeviceInfo = new playerModule.deviceInfo(playerModule.mockPlayer);
  } else {
    const playerModule = await initializePlayer();
    player.BSDeviceInfo = new playerModule.deviceInfo();
    player.registry = new playerModule.registryClass();
  }
  return player;
}
