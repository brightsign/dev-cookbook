const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;
const DUMPS_DIR =
    process.env.RECEIVED_DUMPS_DIR || path.join(__dirname, "received-dumps");

fs.mkdirSync(DUMPS_DIR, { recursive: true });

app.use(
    express.raw({
        type: () => true,
        limit: "100mb",
    })
);

app.post("/crashdump", (req, res) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const bodyBuffer = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    const deviceId = req.headers.deviceid || "unknown-device";
    const dumpFileName = req.headers.dumpfilename || "crash.dump";
    const safeFilename = `${timestamp}-${deviceId}-${dumpFileName}`.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
    );
    const savedFile = path.join(DUMPS_DIR, safeFilename);

    console.log("=================================================");
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );
    console.log("--- Headers ---");
    console.log(JSON.stringify(req.headers, null, 2));
    console.log(`--- Body: ${bodyBuffer.length} bytes ---`);

    if (bodyBuffer.length > 0) {
        fs.writeFileSync(savedFile, bodyBuffer);
        console.log(`--- Body saved to: ${savedFile} ---`);
    }
    console.log("=================================================");

    res.status(200).json({
        message: "Crash dump received.",
        bodyBytes: bodyBuffer.length,
        savedTo: bodyBuffer.length > 0 ? savedFile : null,
    });
});

app.listen(PORT, () => {
    console.log(
        `post-crash-dumps test server listening on http://localhost:${PORT}`
    );
    console.log(`Endpoint: POST http://localhost:${PORT}/crashdump`);
    console.log(`Saving received crash dumps to: ${DUMPS_DIR}`);
});
