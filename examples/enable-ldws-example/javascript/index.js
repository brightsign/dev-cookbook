const DWSConfiguration = require("@brightsign/dwsconfiguration");
const systemClass = require("@brightsign/system");

async function configureLDWS() {
	console.log("Enabling LDWS...");
	const system = new systemClass();

	// Create DWS configuration instance
	const dwsConfig = new DWSConfiguration();
	const config = {
		port: 80,                    // HTTP port for web interface
		password: {
			value: "your_password_here",
			obfuscated: false        // Password stored as plain text
		},
		authenticationList: ["digest"] // Use digest HTTP authentication
	};

	try {
		// Apply LDWS configuration to device
		dwsConfig.applyConfig(config);
		console.log("LDWS enabled!");

		// Reboot device to apply changes
		console.log("Rebooting device to apply changes...");
		system.reboot();
	} catch (error) {
		console.error("Configuration failed:", error.message);
	}
}

configureLDWS();