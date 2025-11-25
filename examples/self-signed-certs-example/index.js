const { Agent } = require('undici');

// Create an agent that accepts self-signed certificates
const httpsAgent = new Agent({
    connect: {
        rejectUnauthorized: false,
    },
});

// Example: Making a request to a BrightSign player with self-signed cert
async function communicateWithPlayer(playerIP, endpoint = '/api/v1/status') {
    const url = `https://${playerIP}:8443${endpoint}`;

    try {
        const response = await fetch(url, {
            dispatcher: httpsAgent
        });

        const data = await response.json();
        console.log('Player response:', data);
        return data;
    } catch (error) {
        console.error('Communication failed:', error.message);
        throw error;
    }
}

// Usage example
if (require.main === module) {
    const playerIP = '192.168.1.100'; // Replace with your player's IP
    communicateWithPlayer(playerIP)
        .then(data => console.log('Success:', data))
        .catch(err => console.error('Error:', err));
}

module.exports = { httpsAgent, communicateWithPlayer };