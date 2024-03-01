import React, { useState, useEffect } from "react";
import "./App.css";

const DeviceInfo = require("@brightsign/deviceinfo");
const os = require("os");
const VideoOutput = require("@brightsign/videooutput");
const VideoModeConfiguration = require("@brightsign/videomodeconfiguration");
const FileSystemInfo = require("@brightsign/filesysteminfo");

function App() {
  const networkInterfaces = os.networkInterfaces() || {};
  const [ipAddress, setIpAddress] = useState({});
  const [uptime, setUptime] = useState(0);
  const [edid, setEdid] = useState("");
  const [resolution, setResolution] = useState("");
  const [storage, setStorage] = useState([100, 100]); // [bytes free, bytes total]

  useEffect(() => {
    const interval = setInterval(async () => {
      const deviceInfo = new DeviceInfo();
      const { deviceUptime } = deviceInfo;
      setUptime(deviceUptime);
      const videoOutputHDMI = new VideoOutput("hdmi");
      const videoConfig = new VideoModeConfiguration();

      const { monitorName } = await videoOutputHDMI.getEdidIdentity();
      const { graphicsPlaneHeight, graphicsPlaneWidth, frequency } =
        await videoConfig.getActiveMode();

      const fileSystemInfo = new FileSystemInfo("/storage/sd");
      const { bytesFree, sizeBytes } = await fileSystemInfo.getStatistics();

      setEdid(monitorName);
      setResolution(
        `${graphicsPlaneHeight}x${graphicsPlaneWidth}@${frequency}`
      );
      setStorage([bytesFree, sizeBytes]);

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

  function displayBytes(n) {
    const k = n > 0 ? Math.floor(Math.log2(n) / 10) : 0;
    const rank = (k > 0 ? "KMGT"[k - 1] : "") + "b";
    const count = Math.ceil(n / Math.pow(1000, k));
    return count + rank;
  }

  return (
    <div className="container">
      <div className="background-img">
        <img src="XD-1035.png" alt="device" />
      </div>
      <div className="column">
        <div className="row">
          <div className="column">
            <h1>{model}</h1>
          </div>
          <div className="column">
            <p>
              <b>Serial:</b> {serialNumber}
            </p>{" "}
            <p>
              <b>Version</b>: {osVersion}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <p>
              <b>Uptime:</b> {uptimeStr}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="column">
            {ipAddress["eth0"] && (
              <div key="eth0">
                <img src="ethernet.png" alt="Ethernet" />
                <b>Ethernet</b>: {ipAddress["eth0"]}
              </div>
            )}

            {ipAddress["wlan0"] && (
              <div key="wlan0">
                <img src="wifi.png" alt="Wifi" />
                <b>Wifi</b>: {ipAddress["wlan0"]}
              </div>
            )}
          </div>
          <div className="column">
            <div>
              <img src="bsn-cloud-logo.png" alt="cloud" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="column">
          <p>
            <img src="display_settings.png" alt="display" />
              {resolution} <br /> <b>EDID</b>: {edid}{" "}
            </p>
          </div>
          <div className="column">
            <p>
              <img src="sd_card.png" alt="display" />
              MicroSD: {displayBytes(storage[1])} <br />
              <progress id="sd" value={storage[0]} max={storage[1]} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
