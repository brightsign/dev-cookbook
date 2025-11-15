# Modem Configuration JavaScript Example

This example demonstrates how to configure a cellular modem using JavaScript using BrightSign APIs. It shows how to:

1. **Configure a modem** with default properties and registry overrides
2. **Retrieve modem information** using AT commands (ICCID, IMEI, Signal Strength)
3. **Handle serial communication** with BrightSign serial port bindings
4. **Manage SIM card verification** and network configuration with USB device detection
5. **Apply network settings** using BrightSign's networking configuration API

## File Structure

```
javascript/
├── index.js                   # Production example with BrightSign APIs
├── package.json               # Project configuration
├── README.md                  # This documentation
```

## Configuration Requirements

### Before Running index.js

1. **Update MODEM_CONFIG** in `index.js`:
   ```javascript
   const MODEM_CONFIG = {
     modems: [{
       model: "Your Modem Model",
       usbDeviceIds: ["1234:5678"]  // Your modem's VID:PID
     }],
     sims: [{
       mcc: "310",                    // Your carrier's MCC
       mnc: "410",                    // Your carrier's MNC  
       connection: {
         apn: "your.apn.here",        // Your carrier's APN
         number: "*99#",
         username: "",
         password: ""
       }
     }]
   };
   ```

2. **Optional Registry Override**: Set `networking.modem_json` in BrightSign registry - `registry write networking modem_json '{"modems":[...],"sims":[...]}'`

3. **Interface Configuration**: Modify interface name and metric as needed:
   ```javascript
   const manager = new ModemManager('ppp0', 100);
   ```

## Running the Example

You need to have Node.js v18 or later installed.
```bash
npm install
npm start
```

## Error Handling

The example includes comprehensive error handling for:
- Serial port connection failures with automatic retry
- AT command timeouts using debounced functions
- Invalid IMSI responses and SIM matching failures
- Registry configuration parsing errors
- USB device detection failures
- Network configuration application errors