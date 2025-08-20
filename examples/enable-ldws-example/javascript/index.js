// Example: Enable LDWS using Node.js @brightsign/dwsconfiguration module
// This method provides more detailed configuration options for LDWS

const DWSConfiguration = require("@brightsign/dwsconfiguration");
const NetworkConfiguration = require("@brightsign/networkconfiguration");

async function configureLDWS() {
	console.log("Configuring Local Diagnostic Web Server via Node.js...");

	// Create DWS configuration instance
	const dwsConfig = new DWSConfiguration();

	// Define comprehensive LDWS configuration
	const config = {
		port: 80,                          // HTTP port for web server
		password: {
			value: "your_password_here",   // Password for web interface access
			obfuscated: false              // Password is in plain text
		},
		authenticationList: ["basic"]      // Support basic HTTP authentication
	};

	try {
		// Primary method: Apply the LDWS configuration using the API
		// This is the recommended approach for most use cases
		dwsConfig.applyConfig(config);
		console.log("LDWS configuration applied successfully!");

		// Get the device IP address from eth0
		const nc = new NetworkConfiguration("eth0");
		const networkConfig = await nc.getConfig();
		const ipAddress = networkConfig.ipAddress || "<device-ip>";
		console.log(`Access web interface at http://${ipAddress}:${config.port}/ with password: ${config.password.value}`);
	} catch (error) {
		console.error("Failed to configure LDWS or retrieve IP address:", error.message);
		console.log(`Access web interface at http://<device-ip>:${config.port}/ with password: ${config.password.value}`);
	}
}

// Run the configuration
configureLDWS();