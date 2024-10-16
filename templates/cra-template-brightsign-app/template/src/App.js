import React, { useState, useEffect } from "react";
import "./App.css";

let DeviceInfo;
let os;

// Import mocked @brightsign modules when developing locally
// When running on a device, these modules are pre-installed globally
// Feel free to modify the mocks as needed for your use case.
if (process.env.NODE_ENV === "development") {
    DeviceInfo = require("./__mocks__/@brightsign/deviceinfo");
    os = require("./__mocks__/os");
} else {
    DeviceInfo = require("@brightsign/deviceinfo");
    os = require("os");
}

function App() {
    const networkInterfaces = os.networkInterfaces() || {};
    const [ipAddress, setIpAddress] = useState("");
    const [header, setHeader] = useState("");

    useEffect(() => {
        const interval = setInterval(async () => {
            const rawText = await fetch("http://localhost:8020/text");
            const { text } = await rawText.json();

            if (text) {
                setHeader(text);
            }

            // Get network interface data
            Object.keys(networkInterfaces).forEach((interfaceName) => {
                networkInterfaces[interfaceName].forEach((interfaceInfo) => {
                    if (interfaceInfo.family === "IPv4") {
                        setIpAddress(
                            `${interfaceName}: ${interfaceInfo.address} `
                        );
                        console.log(
                            `Network Interface - ${interfaceName}: ${interfaceInfo.address}`
                        );
                    }
                });
            });
        }, 5000);

        return () => clearInterval(interval);
    });

    const deviceInfo = new DeviceInfo();
    const { model, osVersion, serialNumber } = deviceInfo;

    return (
        <div className="App">
            <h1>{header || "BrightSign React Web App Example"}</h1>
            <div id="info">
                <div id="ipAddress">
                    <span className="label">IP Address:</span>
                    <span className="value">{ipAddress || "loading..."}</span>
                </div>
                <div id="model">
                    <span className="label">Model:</span>
                    <span className="value">{model || "loading..."}</span>
                </div>
                <div id="osVersion">
                    <span className="label">OS Version:</span>
                    <span className="value">{osVersion || "loading..."}</span>
                </div>
                <div id="serialNumber">
                    <span className="label">Serial Number:</span>
                    <span className="value">
                        {" "}
                        {serialNumber || "loading..."}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default App;
