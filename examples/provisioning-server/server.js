const express = require("express");
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || "./data/provisioning.db";

// Initialize SQLite database
const db = new Database(DB_PATH);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    device_id TEXT PRIMARY KEY,
    device_model TEXT,
    device_family TEXT,
    device_fw_version TEXT,
    first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS check_ins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    recovery_mode TEXT,
    device_uptime INTEGER,
    storage_status TEXT,
    crash_dump BOOLEAN,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES players(device_id)
  );
`);

// Prepared statements for better performance
const upsertPlayer = db.prepare(`
  INSERT INTO players (device_id, device_model, device_family, device_fw_version, last_seen)
  VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(device_id) DO UPDATE SET
    device_model = excluded.device_model,
    device_family = excluded.device_family,
    device_fw_version = excluded.device_fw_version,
    last_seen = CURRENT_TIMESTAMP
`);

const insertCheckIn = db.prepare(`
  INSERT INTO check_ins (device_id, recovery_mode, device_uptime, storage_status, crash_dump)
  VALUES (?, ?, ?, ?, ?)
`);

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log("Headers:", req.headers);
    next();
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve content files for provisioning
app.use("/content", express.static(path.join(__dirname, "content")));

// Main provisioning endpoint
app.get("/provision", (req, res) => {
    const headers = req.headers;

    // Extract BrightSign-specific headers
    const deviceId = headers["deviceid"] || "unknown";
    const deviceModel = headers["devicemodel"] || "unknown";
    const deviceFamily = headers["devicefamily"] || "unknown";
    const deviceFwVersion = headers["devicefwversion"] || "unknown";
    const deviceUpTime = parseInt(headers["deviceuptime"]) || 0;
    const recoveryMode = headers["recoverymode"] || "unknown";
    const storageStatus = headers["storagestatus"] || "";
    const crashDump = headers["crashdump"] === "yes";

    console.log(`\n=== Provisioning Request ===`);
    console.log(`Device ID: ${deviceId}`);
    console.log(`Model: ${deviceModel} (${deviceFamily})`);
    console.log(`Firmware: ${deviceFwVersion}`);
    console.log(`Recovery Mode: ${recoveryMode}`);
    console.log(`Uptime: ${deviceUpTime}s`);
    console.log(`Storage: ${storageStatus}`);
    console.log(`Crash Dump: ${crashDump}`);
    console.log(`===========================\n`);

    // Update database
    try {
        upsertPlayer.run(deviceId, deviceModel, deviceFamily, deviceFwVersion);
        insertCheckIn.run(
            deviceId,
            recoveryMode,
            deviceUpTime,
            storageStatus,
            crashDump ? 1 : 0
        );
    } catch (error) {
        console.error("Database error:", error);
    }

    // Determine response based on recovery mode
    if (recoveryMode === "last-resort") {
        // Player has no autorun - send the provisioning script
        console.log(`→ Sending provisioning autorun to ${deviceId}`);
        const autorunPath = path.join(__dirname, "autorun", "provision.brs");

        if (fs.existsSync(autorunPath)) {
            const autorunContent = fs.readFileSync(autorunPath, "utf8");
            res.setHeader("Content-Type", "text/plain");
            res.setHeader("Retry-After", "7200"); // Check back in 2 hours
            res.send(autorunContent);
        } else {
            console.error("Provisioning autorun not found!");
            res.status(500).send("Provisioning script not available");
        }
    } else if (recoveryMode === "override" || recoveryMode === "periodic") {
        // Player has an autorun - check if we need to update it
        // For this example, we'll tell the player to continue with existing autorun
        console.log(`→ No update needed for ${deviceId}`);
        res.setHeader("Retry-After", "7200"); // Check back in 2 hours
        res.status(204).send(); // No content - continue with existing autorun
    } else {
        // Unknown recovery mode - play it safe
        console.log(`→ Unknown recovery mode, sending 204 to ${deviceId}`);
        res.setHeader("Retry-After", "7200");
        res.status(204).send();
    }
});

// API endpoint to view registered players
app.get("/api/players", (req, res) => {
    try {
        const players = db
            .prepare("SELECT * FROM players ORDER BY last_seen DESC")
            .all();
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to view check-in history
app.get("/api/check-ins/:deviceId?", (req, res) => {
    try {
        const { deviceId } = req.params;
        const limit = parseInt(req.query.limit) || 50;

        let query = "SELECT * FROM check_ins";
        let params = [];

        if (deviceId) {
            query += " WHERE device_id = ?";
            params.push(deviceId);
        }

        query += " ORDER BY timestamp DESC LIMIT ?";
        params.push(limit);

        const checkIns = db.prepare(query).all(...params);
        res.json(checkIns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Graceful shutdown
process.on("SIGINT", () => {
    console.log("\nShutting down gracefully...");
    db.close();
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("\nShutting down gracefully...");
    db.close();
    process.exit(0);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 BrightSign Provisioning Server running on port ${PORT}`);
    console.log(`📊 Database: ${DB_PATH}`);
    console.log(`🔗 Provisioning endpoint: http://localhost:${PORT}/provision`);
    console.log(`📋 View players: http://localhost:${PORT}/api/players`);
    console.log(`📈 View check-ins: http://localhost:${PORT}/api/check-ins\n`);
});
