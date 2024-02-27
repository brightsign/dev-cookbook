import React, { useState, useEffect } from "react";
import "./App.css";

const DeviceInfo = require("@brightsign/deviceinfo");
const os = require("os");

function App() {
  const networkInterfaces = os.networkInterfaces() || {};
  const [ipAddress, setIpAddress] = useState({});
  const [header, setHeader] = useState("");
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { text } = await (await fetch("/text")).json();

      if (text) {
        setHeader(text);
      }

      const deviceInfo = new DeviceInfo();
      const { deviceUptime } = deviceInfo;

      setUptime(deviceUptime);

      // Get network interface data
      Object.keys(networkInterfaces).forEach((interfaceName) => {
        networkInterfaces[interfaceName].forEach((interfaceInfo) => {
          if (interfaceInfo.family === "IPv4") {
            setIpAddress((currentIpAddress) => ({
              ...currentIpAddress,
              [interfaceName]: interfaceInfo.address,
            }));
          }
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  const deviceInfo = new DeviceInfo();
  const { model, osVersion, serialNumber } = deviceInfo;

  const uptimeDate = new Date(uptime * 1000);

  const uptimeStr =
    uptimeDate.getUTCHours() +
    " hours, " +
    uptimeDate.getUTCMinutes() +
    " minutes and " +
    uptimeDate.getUTCSeconds() +
    " second(s)";

  return (
    <div className="container">
      <div className="column">
        <div className="row">
          <div className="column">
            <h1>{model}</h1>
          </div>
          <div className="column">
            Version: {osVersion} Serial: {serialNumber}
          </div>
        </div>
        <div className="row">
          <div className="column">Uptime: {uptimeStr}</div>
        </div>
        <div className="row">
          <div className="column">
            {ipAddress["eth0"] && (
              <div key="eth0" className="row">
                <img src="ethernet.png" alt="Ethernet" />
                Ethernet : {ipAddress["eth0"]}
              </div>
            )}

            {ipAddress["wlan0"] && (
              <div key="wlan0" className="row">
                <img src="wifi.png" alt="Wifi" />
                Wifi : {ipAddress["wlan0"]}
              </div>
            )}
          </div>
          <div className="column">
            <div className="row">
              <img src="bsn-cloud-logo.png" alt="cloud" />
              bsn cloud status
            </div>
          </div>
        </div>
        <div className="row">
          <div className="column">resolution</div>
          <div className="column">storage</div>
        </div>
      </div>
    </div>
  );
}

export default App;
