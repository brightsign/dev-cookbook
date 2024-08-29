export interface DeviceInfo {
    model: string;
    osVersion: string;
    bootVersion: string;
    serialNumber: string;
    family: string;
}

export default class {
    model: string;

    osVersion: string;

    bootVersion: string;

    serialNumber: string;

    family: string;

    constructor(deviceMock: DeviceInfo) {
        this.model = deviceMock.model;
        this.osVersion = deviceMock.osVersion;
        this.bootVersion = deviceMock.bootVersion;
        this.serialNumber = deviceMock.serialNumber;
        this.family = deviceMock.family;
    }
}
