export default class {

    constructor(deviceMock) {
        this.model = deviceMock.model;
        this.osVersion = deviceMock.osVersion;
        this.bootVersion = deviceMock.bootVersion;
        this.serialNumber = deviceMock.serialNumber;
        this.family = deviceMock.family;
    }
}
