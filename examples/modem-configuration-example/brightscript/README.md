# Modem Configuration Guide

This document provides comprehensive guidance on configuring cellular modem settings for optimal performance with BrightSign devices. It works in conjunction with the `configure_modem.brs` script for automated modem setup.

## Overview

The modem configuration system allows BrightSign devices to connect to cellular networks and optionally share that connection with other devices via DHCP. This guide covers both the BrightScript API implementation and the underlying network configuration principles.

## Script Usage

The `configure_modem.brs` script can be ran in 2 ways:

1. As a standalone `autorun.brs` script: Note that in this case, the arguments must be hardcoded within the script itself.
2. From within another `brs` script by using the `Run()` command:

```brightscript
Run("configure_modem.brs", {APN: "your.apn.here", DNS: "8.8.8.8", MODEM: "ppp0", DHCP: "eth0"})
```

Optionally, if you have a serial cable attached to the player, you can break into the `BrightSign>` prompt and run the script directly. This is useful for development purposes. See [this page](https://docs.brightsign.biz/developers/brightsign-shell) for details on accessing the BrightSign shell using a serial connection.

```
BrightSign> script configure_modem.brs [APN="carrier.apn"] [DNS="8.8.8.8"] [MODEM="ppp0"] [DHCP="eth0"]
```

**Parameters:**
- `APN`: Access Point Name for your cellular carrier (default: "giffgaff.com")
- `DNS`: DNS server to use (default: "8.8.8.8")
- `MODEM`: Modem interface name (default: "ppp0")
- `DHCP`: Interface for DHCP server configuration (default: "eth0")

## BrightScript API Reference

### ConfigureModem Function

Configures the cellular modem connection with the specified parameters.

```brightscript
Sub ConfigureModem(pars as Object)
  Print "Configuring modem:"; pars.iface; " APN="; pars.apn
  q = chr(34)     ' double-quote character
  nc = CreateObject("roNetworkConfiguration", pars.iface)
  nc.ResetInterfaceSettings()
  If nc <> invalid Then
    init = "AT+CGDCONT=1," + q + "IP" + q + "," + q + pars.apn + q
    nc.SetDialupNumber("*99#")
    nc.SetDialupUser("")
    nc.SetDialupPassword("")
    nc.SetDialupInitString(init)
    nc.SetRoutingMetric(100) ' Set metric for routing priority; lower values have higher priority
    ok = nc.Apply()
    If not ok Then
      print "Failure calling roNetworkConfiguration.Apply()"
    End If
  Else
    Print "Failure creating roNetworkConfiguration"
  End If
End Sub
```

Refer to [this page](https://docs.brightsign.biz/developers/ronetworkconfiguration) for more details on `roNetworkConfiguration`.

### ConfigureDHCP Function

Sets up DHCP server functionality to share the modem connection.

```brightscript
Sub ConfigureDHCP(pars as Object)
  Print "Configuring DHCP on:"; pars.iface; " DNS="; pars.dns
  nc = CreateObject("roNetworkConfiguration", pars.iface)
  nc.ResetInterfaceSettings()
  nc.SetIp4Address("192.168.10.1")
  nc.SetIp4Netmask("255.255.255.0")
  nc.SetIp4Broadcast("192.168.10.255")
  nc.ConfigureDHCPServer({
    ip4_start: "192.168.10.10",
    ip4_end: "192.168.10.127",
    ip4_gateway: "192.168.10.1",
    name_servers: [pars.dns]
  })
  nc.SetForwardingPolicy({
    forwarding_enabled: true, 
    nat_enabled: true
  })
  nc.Apply()
End Sub
```

**DHCP Configuration:**
- IP Range: 192.168.10.10 - 192.168.10.127
- Gateway: 192.168.10.1
- Subnet: 192.168.10.0/24
- NAT: Enabled for internet sharing

## JavaScript Implementation

### Basic Modem Configuration

```javascript
// Define modem configuration class
class ModemConfiguration {
  constructor(interfaceName = 'ppp0') {
    this.interfaceName = interfaceName;
    // TODO: Initialize system network configuration objects
  }

  async configure(options = {}) {
    const {
      apn = 'placeholder.apn',
      dialupNumber = '*99#',
      username = '',
      password = ''
    } = options;

    try {
      const NetworkConfigClass = require('@brightsign/networkconfiguration');
      const networkConfigModem = new NetworkConfigClass(this.interfaceName);
      const config = await networkConfigModem.getConfig();

      if (config && newModem && newModem.modemStateJson) {
        // Generate initString using apn
        config.initString = 'AT+CGDCONT=1,"IP","' + apn + '"';
        config.number = dialUpNumber;
        config.user = username;
        config.password = password;

        // Optionally set metric as needed; lower values have higher priority
        config.metric = 100;

        const networkConfig = new NetworkConfigClass(this.interfaceName);
        await networkConfig.applyConfig(config);
      }
    } catch(ex) {
      console.error(`Error trying to configure modem`, ex);
    }
  }
}
```

## Traffic Routing

### BrightScript - Using roUrlTransfer

For BrightScript applications, you can bind network requests to specific interfaces:

```brightscript
' Force traffic over modem interface
transfer = CreateObject("roUrlTransfer")
transfer.SetUrl("https://api.example.com/data")
transfer.BindToInterface("ppp0")  ' Use modem interface
result = transfer.GetToFile("response.txt")
```

### JavaScript - System Routing Behavior

JavaScript applications follow system routing rules:

1. **Default Route Priority**: The system uses routing metrics to determine the default interface. The interface with the lowest metric is used as the primary interface for outbound traffic.

2. **Explicit Routing**: JavaScript in Node.js cannot directly manipulate the operating system's routing decisions for outgoing traffic at a low level. However, you can achieve a similar effect by utilizing the `localAddress` option when making network requests, which binds the outgoing connection to a specific local IP address associated with a particular network interface.

3. **Fallback Behavior**: For failover, you can implement logic to detect connection failures and then attempt the request using a different local IP address.

```javascript
const http = require('http');
const https = require('https');
const os = require('os');

// Function to get the IP address of a specific network interface
function getInterfaceIp(interfaceName) {
  const interfaces = os.networkInterfaces();
  const targetInterface = interfaces[interfaceName];
  if (targetInterface) {
    const ipv4 = targetInterface.find(details => details.family === 'IPv4' && !details.internal);
    return ipv4 ? ipv4.address : null;
  }
  return null;
}

// Define your primary and secondary interfaces
const primaryInterfaceName = 'ppp0';
const secondaryInterfaceName = 'eth0';

async function makeRequestWithFailover(url, options = {}) {
  const primaryIp = getInterfaceIp(primaryInterfaceName);
  const secondaryIp = getInterfaceIp(secondaryInterfaceName);

  if (!primaryIp && !secondaryIp) {
    throw new Error('No valid network interfaces found for routing.');
  }

  // Attempt with primary interface
  if (primaryIp) {
    try {
      console.log(`Attempting request via primary interface (${primaryInterfaceName}, IP: ${primaryIp})...`);
      const requestOptions = { ...options, localAddress: primaryIp };
      return await makeActualRequest(url, requestOptions);
    } catch (error) {
      console.error(`Primary interface failed: ${error.message}`);
    }
  }

  // Fallback to secondary interface if primary failed or not available
  if (secondaryIp) {
    try {
      console.log(`Attempting request via secondary interface (${secondaryInterfaceName}, IP: ${secondaryIp})...`);
      const requestOptions = { ...options, localAddress: secondaryIp };
      return await makeActualRequest(url, requestOptions);
    } catch (error) {
      console.error(`Secondary interface failed: ${error.message}`);
      throw new Error(`All interfaces failed to make the request: ${error.message}`);
    }
  }

  throw new Error('No successful connection could be established through any available interface.');
}

function makeActualRequest(url, options) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data: data });
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

// Example usage:
try {
  const result = await makeRequestWithFailover('http://example.com');
  console.log('Request successful:', result.statusCode);
  // console.log('Response data:', result.data); // Uncomment to see response body
} catch (error) {
  console.error('Failed to make request:', error.message);
}
```

## Troubleshooting

### Common Issues

1. **Connection Fails**
   - Verify APN settings with carrier
   - Check SIM card activation
   - Verify signal strength

2. **DHCP Not Working**
   - Check interface configuration
   - Verify NAT settings
   - Check firewall rules

3. **No Internet Access**
   - Verify DNS configuration
   - Check routing table
   - Test with different DNS servers
