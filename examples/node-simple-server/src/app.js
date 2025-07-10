const DIClass = require("@brightsign/deviceinfo");
const http = require("http");
const fs = require("fs");
const path = require("path");

function app() {
    return new Promise((resolve, reject) => {
        const di = new DIClass();

        const server = http.createServer((req, res) => {
            // Serve device info on /api/device-info
            if (req.url === '/api/device-info') {
                res.setHeader("Content-Type", "application/json");
                const jsonResponse = JSON.stringify(di);
                return res.end(jsonResponse);
            }

            // Serve static files from /storage/sd/
            const filePath = path.join('/storage/sd', req.url === '/' ? 'index.html' : req.url);
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(404);
                    res.end('File not found');
                    return;
                }

                // Set content type based on file extension
                const ext = path.extname(filePath);
                const contentType = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                }[ext] || 'text/plain';

                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            });
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
