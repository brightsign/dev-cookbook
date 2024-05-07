import { displayCurrentNetwork, displayDeviceInfo } from './info';
import { createSocket } from './ws-client';
import { getConfig } from './config';

const config = getConfig();

const start = async () => {
  console.log(`config.env: desktop mode - ${config.isDesktop}, environment - ${config.nodeEnv}`);

  if (!config.isDesktop) {
    displayCurrentNetwork();
    await displayDeviceInfo();
  }

  await createSocket();
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
