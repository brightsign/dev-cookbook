const http = require("http");
const main = require("./app.js");

describe("HTTP Server Response", () => {
    let server;
    const port = 13131;

    beforeAll(async () => {
        server = await main();
    });

    afterAll(() => {
        if (server) {
            server.close();
        }
    });

    it("should respond with JSON containing mocked device info", async () => {
        const response = await new Promise((resolve, reject) => {
            http.get(`http://localhost:${port}/api/device-info`, (res) => {
                expect(res.statusCode).toBe(200);
                expect(res.headers["content-type"]).toBe("application/json");

                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    const receivedData = JSON.parse(data);

                    // Verify that the response contains the mocked device info
                    expect(receivedData.model).toBe("MockModel");
                    expect(receivedData.osVersion).toBe("MockOSVersion");
                    expect(receivedData.serialNumber).toBe("MockSerialNumber");
                    resolve(receivedData);
                });
            }).on("error", (err) => {
                reject(err);
            });
        });
        expect(response).toBeDefined();
    });

    it("should return 404 for non-existent files", async () => {
        await new Promise((resolve, reject) => {
            http.get(
                `http://localhost:${port}/non-existent-file.txt`,
                (res) => {
                    expect(res.statusCode).toBe(404);
                    resolve();
                }
            ).on("error", (err) => {
                reject(err);
            });
        });
    });
});
