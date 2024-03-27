diClass = require("@brightsign/deviceinfo");
http = require("http");

function main() {
    di = new diClass();

    const server = http.createServer((req, res) => {
        // Set the response header with the appropriate content type for JSON
        res.setHeader("Content-Type", "application/json");

        // Convert the object to a JSON-formatted string
        const jsonResponse = JSON.stringify(di);

        // Send the JSON response
        res.end(jsonResponse);
    });

    const port = 13131;
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    return server;
}

const server = main();

module.exports = server;
