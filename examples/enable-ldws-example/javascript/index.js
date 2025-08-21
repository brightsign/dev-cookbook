const DWSConfiguration = require("@brightsign/dwsconfiguration");
const NetworkConfiguration = require("@brightsign/networkconfiguration");

async function configureLDWS() {
	console.log("Enabling LDWS...");

	// Create DWS configuration instance
	const dwsConfig = new DWSConfiguration();
	const config = {
		port: 80,                    // HTTP port for web interface
		password: {
			value: "your_password_here",
			obfuscated: false        // Password stored as plain text
		},
		authenticationList: ["basic"] // Use basic HTTP authentication
	};

	try {
		// Apply LDWS configuration to device
		dwsConfig.applyConfig(config);
		console.log("LDWS enabled!");

		// Get device IP address to show user where to connect
		const nc = new NetworkConfiguration("eth0");
		const networkConfig = await nc.getConfig();
		const ipAddress = networkConfig.ipAddress || "<device-ip>";
		console.log(`Access: http://${ipAddress}/`);
		console.log(`Password: ${config.password.value}`);
	} catch (error) {
		console.error("Configuration failed:", error.message);
		console.log(`Access: http://<device-ip>/`);
		console.log(`Password: ${config.password.value}`);
	}
}

configureLDWS();