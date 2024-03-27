// __mocks__/@brightsign/videooutputconfiguration.js

class VideoOutputConfiguration {
    constructor() {
        this.getActiveMode = () => Promise.resolve({graphicsPlaneHeight: "1080", graphicsPlaneWidth: "1920", frequency: "60hz"})
    }
}
  
module.exports = VideoOutputConfiguration;