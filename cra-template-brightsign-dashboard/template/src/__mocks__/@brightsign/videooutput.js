// __mocks__/@brightsign/videooutput.js

class VideoOutput {
    constructor() {
        this.getEdidIdentity = () =>
            Promise.resolve({ monitorName: "mockMonitor" });
    }
}

module.exports = VideoOutput;
