// __mocks__/os.js

class OSClass {
    static networkInterfaces() {
        return {
            eth0: [
                {
                    family: "IPv4",
                    address: "0.0.0.0",
                },
            ],
        };
    }
}

module.exports = OSClass;
