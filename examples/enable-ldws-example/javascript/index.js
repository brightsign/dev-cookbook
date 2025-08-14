// Example: Enable LDWS using Node.js @brightsign/dwsconfiguration module
// This method provides more detailed configuration options for LDWS

const DWSConfiguration = require("@brightsign/dwsconfiguration");

console.log("Configuring Local Diagnostic Web Server via Node.js...");

// Create DWS configuration instance
const dwsConfig = new DWSConfiguration();

// Define comprehensive LDWS configuration
const config = {
	port: 80,                          // HTTP port for web server
	password: {
		value: "your_password_here",   // Password for web interface access
		obfuscated: false              // Password is in plain text (not obfuscated)
	},
	authenticationList: ["basic"]      // Support basic HTTP authentication
};

try {
	// Apply the LDWS configuration
	dwsConfig.applyConfig(config);
	console.log("LDWS configuration applied successfully!");
	console.log(`Access web interface at http://<device-ip>:${config.port}/ with password: ${config.password.value}`);
} catch (error) {
	console.error("Failed to configure LDWS:", error.message);
}