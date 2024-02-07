import React, {useState, useEffect} from 'react';
import './App.css';

const DeviceInfo = require('@brightsign/deviceinfo');
const os = require('os');

function App() {
  const networkInterfaces = os.networkInterfaces() || {};
  const [ipAddress, setIpAddress] = useState('');
  const [header, setHeader] = useState('');

  useEffect(() => {
    const interval = setInterval(async () => {

      const {text} = await (await fetch('/text')).json();

      if(text) {
        setHeader(text);
      }

      // Get network interface data
      Object.keys(networkInterfaces).forEach((interfaceName) => {
        networkInterfaces[interfaceName].forEach((interfaceInfo) => {
          if (interfaceInfo.family === 'IPv4') {
            setIpAddress(`${interfaceName}: ${interfaceInfo.address} `);
            console.log(
              `Network Interface - ${interfaceName}: ${interfaceInfo.address}`
            );
          }
        });
      });

    }, 5000)

    return () => clearInterval(interval)
  })

  const deviceInfo = new DeviceInfo();
  const { model, osVersion, serialNumber } = deviceInfo;

  return (
    <div className="App">
      <h1>{header || "BrightSign React Web App Example"}</h1>
      <div id="info">
        <div id="ipAddress">
          <span class="label">IP Address:</span>
          <span class="value">{ipAddress || "loading..."}</span>
        </div>
        <div id="model">
          <span class="label">Model:</span>
          <span class="value">{model || "loading..."}</span>
        </div>
        <div id="osVersion">
          <span class="label">OS Version:</span>
          <span class="value">{osVersion || "loading..."}</span>
        </div>
        <div id="serialNumber">
          <span class="label">Serial Number:</span>
          <span class="value">{serialNumber || "loading..."}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
