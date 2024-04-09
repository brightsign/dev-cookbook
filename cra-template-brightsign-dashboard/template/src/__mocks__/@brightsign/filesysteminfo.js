// __mocks__/@brightsign/filesysteminfo.js

class FileSystemInfo {
    constructor() {
        this.getStatistics = () =>
            Promise.resolve({ bytesFree: 1000, sizeBytes: 1000 });
    }
}

// Export the mock class
module.exports = FileSystemInfo;
