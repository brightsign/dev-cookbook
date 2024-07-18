const DIClass = require("@brightsign/deviceinfo");
const http = require("http");

function app() {
    return new Promise((resolve, reject) => {
        const di = new DIClass();

        const server = http.createServer((req, res) => {
            res.setHeader("Content-Type", "application/json");

            const jsonResponse = JSON.stringify(di);

            res.end(jsonResponse);
        });

        const port = 13131;
        server.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
            resolve(server);
        });

        server.on("error", reject);
    });
}

module.exports = app;
