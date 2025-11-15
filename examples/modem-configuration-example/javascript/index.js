#!/usr/bin/env node
'use strict';

/**
 * Modem Configuration Example
 * 
 * This examples demonstrates the following core concepts:
 * 1. Loading configuration with registry overrides
 * 2. Sending AT commands to get modem information
 * 3. Parsing responses for ICCID, IMEI, and signal strength
 */

const EventEmitter = require('events');
const registryClass = require('@brightsign/registry');
const networkingConfigClass = require('@brightsign/networkconfiguration');
const deviceInfoClass = require('@brightsign/deviceinfo');
const BrightSignBinding = require('@brightsign/serialport');

// TODO: Replace following values with your modem and SIM details
const MODEM_CONFIG = {
  // Define supported modems by their USB VID:PID (optional)
  modems: [{
    model: "My Test Modem",
    usbDeviceIds: ["VID:PID"]
  }],
  // Define SIM configurations
  sims: [{
    mcc: "YOUR_MCC_VALUE",
    mnc: "YOUR_MNC_VALUE",
    connection: {
      apn: "YOUR_APN_VALUE",
      number: "*99#",
      username: "",
      password: ""
    }
  }]
};

// AT Command response parser utilities
class ATCommandParser {
  static parseIMSI(response) {
    // AT+CIMI response: "AT+CIMI\r\n901280004878622\r\n\r\nOK\r\n"
    const match = response.match(/\r\n(\d{15,20})\r\n/);
    return match ? match[1] : null;
  }

  static parseModemInfo(response) {
    // ATI response contains manufacturer, model, revision, IMEI
    const info = {};
    const lines = response.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('Manufacturer:')) {
        info.manufacturer = trimmed.split(':')[1].trim();
      } else if (trimmed.includes('Model:')) {
        info.model = trimmed.split(':')[1].trim();
      } else if (trimmed.includes('IMEI:')) {
        info.imei = trimmed.split(':')[1].trim();
      } else if (trimmed.includes('Revision:')) {
        info.revision = trimmed.split(':')[1].trim();
      }
    }
    
    return info;
  }

  static parseICCID(response) {
    // AT+ICCID response: "AT+ICCID\r\nICCID: 89882390000156081575\r\n\r\nOK\r\n"
    const match = response.match(/ICCID:\s*(\d+)/);
    return match ? match[1] : null;
  }

  static parseNetworkOperator(response) {
    // AT+COPS? response: "AT+COPS?\r\n+COPS: 0,0,\"T-Mobile\",7\r\n\r\nOK\r\n"
    const match = response.match(/\+COPS:\s*\d+,\d+,"([^"]+)"/);
    return match ? match[1] : null;
  }

  static parseSignalStrength(response) {
    // AT^HCSQ? response: "AT^HCSQ?\r\n^HCSQ:\"LTE\",79,119,-104,19\r\n\r\nOK\r\n"
    const match = response.match(/\^HCSQ:"[^"]+",\d+,\d+,(-?\d+),\d+/);
    if (match) {
      const rsrp = parseInt(match[1]); // RSRP (Reference Signal Received Power)
      // Convert RSRP to percentage (approximate)
      if (rsrp >= -80) return 100;
      if (rsrp >= -90) return 75;
      if (rsrp >= -100) return 50;
      if (rsrp >= -110) return 25;
      return 10;
    }
    return 0;
  }
}

// Modem simulator for demonstration
class ModemSimulator extends EventEmitter {
  constructor() {
    super();
    this.isConnected = false;
    this.port = null;
    this.commandsArray = [];
  }

  /* onModemData(data) {
    // Keeping the next commented line for testing purposes
    // console.log('State: ' + this.state + '\n >= Received: ' + data);

    // Sample data: "AT+CIMI\r\n901288002281217\r\n\r\nOK\r\n"
    const parts = data.trim().split('\n');
    if(parts.length > 2 && data.indexOf('OK') > 0) {
      const cmdName = parts[0].trim();
      switch(cmdName) {
        case 'AT+CIMI': { // AT+CIMI\r\r\n901280004878622\r\n\r\nOK
          const modemCimi = ATCommandParser.parseIMSI(data);
          console.log(`CIMI response: ${modemCimi}`);
          break;
        }

        case 'ATI': {
          // \r\nATI\r\r\nManufacturer: Vodafone\r\nModel: IK41US_USBC4G_V2_NA\r\nRevision: IK41_00_02.00_13\r\nSVN: D\r\nIMEI: 352598110250336\r\n\r\nOK
          const modemValues = ATCommandParser.parseModemInfo(data);
          console.log(`ATI result: ${JSON.stringify(modemValues)}`);
          break;
        }

        case 'AT+ICCID': { // \r\nAT+ICCID\r\r\nICCID: 89882390000156081575\r\n\r\nOK
          const modemIccId = ATCommandParser.parseICCID(data);
          console.log(`ICC ID: ${modemIccId}`);
          break;
        }

        case 'AT+COPS?': { // \r\nAT+COPS?\r\n+COPS: 0,0,"T-Mobile DATA ONLY",7\r\n\r\nOK
          const modemNetworkName = ATCommandParser.parseNetworkOperator(data);
          console.log(`Modem network name: ${modemNetworkName}`);
          break;
        }

        case 'AT^HCSQ?': { // \r\nAT^HCSQ?\r\n^HCSQ:"LTE",79,119,-104,19\r\n\r\nOK
          const modemSignal = ATCommandParser.parseSignalStrength(data);
          console.log(`HCSQ signal value : ${modemSignal}`);
          break;
        }

        default: {
          console.log('Unexpected modem data');
          break;
        }
      }
    }
  } */

  connect() {
    if (this.port && this.port.isOpen) {
      this.port.write('AT+CIMI' + String.fromCharCode(13));
    } else {
      console.log('[MODEM] Connecting to modem...');

      // create & open a new serial port
      const { SerialPortStream } = require('@serialport/stream');
      const { DelimiterParser } = require('@serialport/parser-delimiter');
      const portOptions = {
        path: '/dev/modem_status',
        baudRate: 115200,
        binding: BrightSignBinding,
      };
      
      // In v12.0.0, the constructor no longer takes a callback function
      this.port = new SerialPortStream(portOptions);
      
      // Instead we need to listen to the 'open' event
      this.port.on('open', () => {
        console.log('[MODEM] Serial port opened successfully');
        // if no error, send the CIMI command to get the SIM ID
        if (this.port && this.port.isOpen) {
          this.port.write('AT+CIMI' + String.fromCharCode(13));
        }

        this.isConnected = true;
        console.log('[MODEM] Connected successfully');
        this.emit('connected');
      });
      
      // The error event will be triggered if there's an issue opening the port
      this.port.on('error', (error) => {
        console.error('[MODEM] Serial port open error: ', error);
        this.disconnect();
      });
      
      this.port.on('close', () => this.disconnect());

      // Reference: https://serialport.io/docs/api-parser-delimiter/
      const parser = new DelimiterParser({ delimiter: 'OK', includeDelimiter: true });
      this.port.pipe(parser);
      parser.on('data', (msg) => {
        const data = Buffer.from(msg).toString('ascii');

        // Keeping the next commented line for testing purposes
        // console.log('State: ' + this.state + '\n >= Received: ' + data);

        // Sample data: "AT+CIMI\r\n901288002281217\r\n\r\nOK\r\n"
        const parts = data.trim().split('\n');
        if(parts.length > 2 && data.indexOf('OK') > 0) {
          const cmdName = parts[0].trim();
          for (let i = 0; i < this.commandsArray.length; i++) {
            const entry = this.commandsArray[i];
            if (entry.emitter && entry.commandType === cmdName) {
              entry.emitter.emit(entry.commandType + '_receive', data);
              break;
            }
          }
        }
      });
    }
  }

  sendCommand(command) {
    return new Promise((resolve) => {
      if (!this.isConnected) {
        resolve('ERROR: Not connected');
        return;
      }
      const newRequest = {
        emitter: new EventEmitter(),
        commandType: command,
        debouncedFn: _.debounce(function () {
          const message = `Request timed out`;
          console.log(message);
          // Remove this instance from the array
          const index = this.commandsArray.findIndex((x) => x.commandType === commandType);
          if (index > -1) {
            this.commandsArray.splice(index, 1);
          }
          return reject(new Error(message));
        }, 5000),
      };
      newRequest.debouncedFn();
      this.commandsArray.push(newRequest);

      newRequest.emitter.on(commandType + '_receive', function (msg) {
        try {
          // Find the first entry for the responseType, 
          // cancel its timeout fn and remove it from the array
          const index = this.commandsArray.findIndex((x) => x.commandType === commandType);
          if (index > -1) {
            if (this.commandsArray[index].debouncedFn) {
              this.commandsArray[index].debouncedFn.cancel();
            }
            this.commandsArray[index].emitter = null;
            this.commandsArray.splice(index, 1);
          }
          return resolve(msg);

        } catch (error) {
          const msg = `[MODEM] Error in EventEmitter on listener for command: ${command}, error: ${error.message}`;
          console.log(msg);
          reject({ error: msg });
        }
      });

      // Send command to modem
      console.log(`[MODEM] Sending: ${command}`);
      this.port.write(command + String.fromCharCode(13));
    });
  }

  disconnect() {
    console.log('[MODEM] Disconnect in state: ' + this.state);
    if (this.port && this.port.isOpen) {
      this.port.close(function cb(err) {
        if(err) {
          console.error(`onClose error: ${err.message}`);
        }
        this.port = null;
      });
    } else {
      // Since every state runs a timer, we should re-open soon
    }
    this.isConnected = false;
    console.log('[MODEM] Disconnected');
  }
}

/**
 * Modem Manager
 */
class ModemManager {
  constructor(name, metric) {
    this.modem = new ModemSimulator();
    this.registry = new Registry();
    this.config = null;
    this.interfaceName = name || 'ppp0';
    this.metric = metric || null;
  }

  /**
   * Load configuration with registry overrides
   */
  async loadConfiguration() {
    try {
      console.log('[CONFIG] Loading modem configuration...');
      this.config = { ...MODEM_CONFIG };
      const playerRegistry = new registryClass();
      const override = await playerRegistry.read('networking', 'modem_json');

      if (override) {
        const overrideConfig = JSON.parse(override);
        if (overrideConfig.sims) {
          this.config.sims = [...overrideConfig.sims];
        }
        if (overrideConfig.modems) {
          this.config.modems = [...overrideConfig.modems];
        }
      } else {
        console.log('[CONFIG] No registry override found, using defaults');
      }
    } catch (error) {
      console.log('[CONFIG] Error reading registry, using defaults:', error.message);
    }
    
    console.log('[CONFIG] Final configuration:', JSON.stringify(this.config, null, 2));
    return this.config;
  }

  /**
   * Configure modem with loaded settings
   */
  async configureModem(matchingSim = MODEM_CONFIG.sims[0]) {
    const networkConfigModem = new networkingConfigClass(this.interfaceName);
    const config = await networkConfigModem.getConfig();

    if (config) {
      // Generate initString using apn
      const dialUpApn = _.get(matchingSim, 'connection.apn');
      const dialUpNumber = _.get(matchingSim, 'connection.number');
      const dialUpUsername = _.get(matchingSim, 'connection.username');
      const dialUpPassword = _.get(matchingSim, 'connection.password');

      config.initString = 'AT+CGDCONT=1,"IP","' + dialUpApn + '"';
      config.number = dialUpNumber;
      config.user = dialUpUsername;
      config.password = dialUpPassword;

      // Optionally set metric for the interface; lower values have higher priority
      if(this.metric) {
        config.metric = this.metric;
      }

      console.log('[CONFIG] Applying modem configuration:', config);
      await networkConfigModem.applyConfig(apnConfig);
    }
    return config;
  }

  /**
   * Find SIM configuration that matches the IMSI
   */
  findMatchingSim(imsi) {
    if (!this.config || !this.config.sims) {
      return null;
    }

    for (const sim of this.config.sims) {
      const simPrefix = sim.mcc + sim.mnc;
      if (imsi.startsWith(simPrefix)) {
        console.log(`[CONFIG] IMSI ${imsi} matches SIM config: MCC=${sim.mcc}, MNC=${sim.mnc}`);
        return sim;
      }
    }

    // Parse out mcc and mnc from IMSI and return in default format if no match found
    const mcc = imsi.substring(0, 3);
    const mnc = imsi.substring(3, 5);
    console.log(`[CONFIG] No exact match found for IMSI ${imsi}. Using default format MCC=${mcc}, MNC=${mnc}`);
    return { mcc, mnc };
  }

  /**
   * Get comprehensive modem information
   */
  async getModemInformation() {
    console.log('\n[INFO] Retrieving modem information...');
    
    const info = {
      modem: {},
      sim: {},
      connection: {}
    };

    try {
      // Get modem identification (includes IMEI)
      const atiResponse = await this.modem.sendCommand('ATI');
      info.modem = ATCommandParser.parseModemInfo(atiResponse);

      // Get SIM IMSI
      const cimiResponse = await this.modem.sendCommand('AT+CIMI');
      info.sim.imsi = ATCommandParser.parseIMSI(cimiResponse);

      // Get SIM ICCID
      const iccidResponse = await this.modem.sendCommand('AT+ICCID');
      info.sim.iccid = ATCommandParser.parseICCID(iccidResponse);

      // Get network operator
      const copsResponse = await this.modem.sendCommand('AT+COPS?');
      info.connection.operator = ATCommandParser.parseNetworkOperator(copsResponse);

      // Get signal strength
      const hcsqResponse = await this.modem.sendCommand('AT^HCSQ?');
      info.connection.signalStrength = ATCommandParser.parseSignalStrength(hcsqResponse);

    } catch (error) {
      console.error('[INFO] Error retrieving modem information:', error.message);
    }

    return info;
  }

  isMatchingVidPid(elem, configuredModems) {
    for (const modem of configuredModems) {
      for(const usbId of modem.usbDeviceIds) {
        const [vid, pid] = usbId.split(':');
        if (elem.vid == vid && elem.pid == pid) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * A recursive function used to parse through the result of GetUSBTopology()
   * to find a supported modem device i.e.
   * matching the configuredModems' vid:pid combination
   */
  findSupportedModemDevice(usbT, configuredModems) {
    let result;
    for(const elem of usbT) {
      if(isMatchingVidPid(elem, configuredModems)) {
        result = elem;
        break;
      }
      if(elem.children) {
        result = findSupportedModemDevice(elem.children, configuredModems);
        if (result) break;
      }
    }
    return result;
  }

  /**
   * Complete modem setup process
   */
  async setupModem() {
    console.log('\n=== MODEM SETUP PROCESS ===\n');

    try {
      await this.loadConfiguration();

      await new Promise((resolve) => {
        this.modem.on('connected', resolve);
        this.modem.connect();
      });

      // Optional: Get USB devices and match against known modems
      if (this.config.modems && this.config.modems.length > 0) {
        console.log('[SETUP] Checking connected USB devices for known modems...');

        const devceInfo = new deviceInfoClass();
        const usbT = await devceInfo.getUSBTopology();
        const matchedDevice = this.findSupportedModemDevice(usbT, this.config.modems);
        if (matchedDevice) {
          console.log(`[SETUP] Found supported modem device: VID=${matchedDevice.vid}, PID=${matchedDevice.pid}`);
        }
      }

      /* Optional section: 
       1. Get IMSI from modem
       2. Match IMSI to one of the override (or default) SIM values
       3. Configure the modem only if a match is found
       */

      let matchingSim = null;
      if (this.config.sims && this.config.sims.length > 0) {
        console.log('[SETUP] Attempting to match IMSI to SIM configuration...');
        // 1. Get IMSI response
        const cimiResponse = await this.modem.sendCommand('AT+CIMI');
        const imsi = ATCommandParser.parseIMSI(cimiResponse);
        if (!imsi) {
          throw new Error('Failed to get IMSI from modem');
        }
        console.log(`[CONFIG] Configuring modem for IMSI: ${imsi}`);

        // 2. Find matching SIM configuration
        const matchingSim = this.findMatchingSim(imsi);
        if (!matchingSim) {
          throw new Error(`No configuration found for IMSI: ${imsi}`);
        }
      }

      const config = await this.configureModem(matchingSim);
      const info = await this.getModemInformation();
      console.log('\n=== MODEM SETUP COMPLETE ===\n');
      return {
        config,
        info,
        success: true
      };

    } catch (error) {
      console.error('[SETUP] Modem setup failed:', error.message);
      return {
        error: error.message,
        success: false
      };
    } finally {
      this.modem.disconnect();
    }
  }
}

async function main() {
  console.log('📡 Modem Configuration Example\n');
  const manager = new ModemManager('ppp0', 100); // Example interface name and metric
  const result = await manager.setupModem();
  console.log('\n=== FINAL RESULT ===\n', JSON.stringify(result, null, 2));
}

// Run the example
main().catch((error) => {
  console.error('Unexpected error in modem configuration example:', error);
});