# Self-Signed Certificate Handling Example

## Introduction

This example demonstrates how to handle self-signed certificates when communicating with BrightSign players via the local Diagnostic Web Server (DWS). BrightSign players use self-signed certificates for HTTPS communication, which requires configuring your HTTP client to accept these certificates for successful player communication and management.

## How it Works

1. **Certificate Generation**: BrightSign players automatically generate self-signed certificates for secure HTTPS communication
2. **Client Configuration**: Standard HTTP clients reject self-signed certificates by default for security reasons
3. **Agent Setup**: The example creates an HTTPS agent with `rejectUnauthorized: false` to accept self-signed certificates
4. **API Communication**: Uses the configured agent to make secure requests to the player's DWS endpoints

## How to Run the Example

### Prerequisites

1. **Node.js Environment**: Ensure you have Node.js installed on your development machine
2. **Network Connection**: Your computer and BrightSign player should be on the same network
3. **Player IP Address**: Know the IP address of your BrightSign player

### Steps to Run

1. **Install Dependencies**:
   ```bash
   npm install undici
   ```

2. **Update Player IP**:
   - Open `index.js`
   - Replace `192.168.1.100` with your player's actual IP address

3. **Run the Example**:
   ```bash
   node index.js
   ```

4. **Expected Output**:
   - If successful, you'll see the player's status response in JSON format
   - Any communication errors will be displayed with descriptive error messages

## Files Structure

- **index.js**: Main example file showing how to configure undici Agent for self-signed certificates
- **README.md**: This documentation file

## Important Security Notes

- Only disable certificate verification (`rejectUnauthorized: false`) for trusted BrightSign player communication
- Never use this configuration for external or untrusted HTTPS endpoints
- This approach is specifically designed for local development and player management scenarios
- Default DWS port is `8443` for HTTPS communication