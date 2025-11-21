const dgram = require('dgram');

const PORT = 5000;
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.bind(PORT);
