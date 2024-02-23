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
      <ul class="container">
        <li class="column"/>
        <li class="column">
            <li class="row">  model: {model}, version: {osVersion} {/** model, serial, os */}</li>
            <li class="row"> location {/** location */} </li>
            <li class="row"> 
              <li class="column"> 
                <li class="row"> ipAddress {ipAddress} {/** ip, mac wired */} </li>
                <li class="row"> ipAddress {ipAddress}{/** ip, mac wireless */}</li>
              </li>
              <li class="column">
                <li class="row"> bsn cloud status{/** bsn cloud status, network, deployment type */} </li>
              </li>
            </li>

            <li class="row"> 
              <li class="column"> 
                <li class="row"> screen resolution{/** resolution, edid */} </li>
              
              </li>
              <li class="column">
                <li class="row"> storage capacity {/** storage, capacity */} </li>
              </li>
            </li>
            
            </li>
      </ul>
    </div>
  );
}

export default App;
