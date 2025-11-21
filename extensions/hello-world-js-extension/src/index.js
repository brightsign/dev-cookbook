// --- Constants ---
const dgram = require('dgram');

// UDP port to send messages to
const PORT = process.env.PORT || 5000;

// Host address for UDP messages
const HOST = '127.0.0.1';

/**
 * Interval (ms) between sending UDP messages.
 * Controls how often the device info is sent.
 */
const SEND_INTERVAL_MS = 5000;

/**
 * Startup delay (ms) before starting the main interval.
 * Should be a conservative time to ensure the BrightSign JS APIs become available.
 */
const STARTUP_DELAY_MS = 60000;

const udpSocket = dgram.createSocket('udp4');

function sendTimestamp() {
    const DeviceInfoClass = require('@brightsign/deviceinfo');
    const deviceInfo = new DeviceInfoClass();

    const message = Buffer.from(
        `Hello World! from ${deviceInfo.serialNumber}: ${new Date().toISOString()}`
    );
    console.log('Sending UDP message:', message.toString());

    udpSocket.send(message, PORT, HOST, (err) => {
        if (err) {
            console.error('UDP send error:', err);
        }
    });
}

function main() {
    if (!PORT) {
        console.error('PORT environment variable is not set.');
        return;
    }

    let appInterval;
    console.log('Waiting for BrightSign app to load ...');
    setTimeout(() => {
        appInterval = setInterval(sendTimestamp, SEND_INTERVAL_MS);
    }, STARTUP_DELAY_MS);

    process.on('SIGINT', () => {
        console.log('Received SIGINT. Exiting...');
        clearInterval(appInterval);
        udpSocket.close();
        process.exit();
    });

    process.on('SIGTERM', () => {
        console.log('Received SIGTERM. Exiting...');
        clearInterval(appInterval);
        udpSocket.close();
        process.exit();
    });
}

main();
