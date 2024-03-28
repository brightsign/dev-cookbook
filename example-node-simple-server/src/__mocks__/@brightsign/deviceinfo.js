// __mocks__/@brightsign/deviceinfo.js

const startTime = Date.now() / 1000;

class DeviceInfo {
    constructor() {
        this.model = "MockModel";
        this.osVersion = "MockOSVersion";
        this.serialNumber = "MockSerialNumber";
        this.deviceUptime = Date.now() / 1000 - startTime;
    }
}

// Export the mock class
module.exports = DeviceInfo;
