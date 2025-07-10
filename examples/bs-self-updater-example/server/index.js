const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 7000;

app.get("/autorun.zip", (req, res) => {
    const zipPath = path.join(__dirname, "autorun.zip");
    fs.access(zipPath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: "autorun.zip not found" });
        }
        res.sendFile(zipPath, (err) => {
            if (err) {
                res.status(500).json({ error: "Failed to send file" });
            }
        });
    });
});

// Catch-all error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
