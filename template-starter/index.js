let DeviceInfo = require("@brightsign/deviceinfo");
let os = require("os");

function start() {
    const networkInterfaces = os.networkInterfaces() || {};

    // Get network interface data
    Object.keys(networkInterfaces).forEach((interfaceName) => {
        networkInterfaces[interfaceName].forEach((interfaceInfo) => {
            if (interfaceInfo.family === "IPv4") {
                setIpAddress(
                    `${interfaceName}: ${interfaceInfo.address} `
                );
                console.log(`IP Address - ${interfaceName}: ${interfaceInfo.address}`);
            }
        });
    });

    const deviceInfo = new DeviceInfo();
    const { model, osVersion, serialNumber } = deviceInfo;

    return (
        <div className="App">
            <h1>{header || "BrightSign Starter Template"}</h1>
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

window.main = start;
