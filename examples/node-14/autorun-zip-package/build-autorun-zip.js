// build-autorun-zip.js
// Node.js script to create autorun.zip package for BrightSign players

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// ANSI color codes
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logError(message) {
    log(message, colors.red);
}

function logSuccess(message) {
    log(message, colors.green);
}

function logWarning(message) {
    log(message, colors.yellow);
}

function logInfo(message) {
    log(message, colors.blue);
}

// Paths
const scriptDir = __dirname;
const setupFilesDir = path.join(scriptDir, "setup-files");
const outputFile = path.join(scriptDir, "autorun.zip");

console.log("========================================");
logInfo("BrightSign autorun.zip Builder");
console.log("========================================");
console.log("");

// Check if setup-files directory exists
if (!fs.existsSync(setupFilesDir)) {
    logError(`ERROR: setup-files directory not found at: ${setupFilesDir}`);
    process.exit(1);
}

// Check if autozip.brs exists
const autozipPath = path.join(setupFilesDir, "autozip.brs");
if (!fs.existsSync(autozipPath)) {
    logError("ERROR: autozip.brs not found in setup-files directory");
    console.log("This file is required for autorun.zip to work");
    process.exit(1);
}

// Check if autorun.brs exists
const autorunPath = path.join(setupFilesDir, "autorun.brs");
if (!fs.existsSync(autorunPath)) {
    logWarning("WARNING: autorun.brs not found in setup-files directory");
    console.log("Your application may not run after extraction");
}

// Remove existing autorun.zip if it exists
if (fs.existsSync(outputFile)) {
    logWarning("Removing existing autorun.zip...");
    fs.unlinkSync(outputFile);
}

// Create the zip file
logSuccess("Creating autorun.zip package...");
console.log("");
console.log("Source directory:", setupFilesDir);
console.log("Output file:", outputFile);
console.log("");

logInfo("Compressing files...");

// Create a file to stream archive data to
const output = fs.createWriteStream(outputFile);
const archive = archiver("zip", {
    zlib: { level: 9 }, // Maximum compression
});

// Track files added
let fileCount = 0;
let dirCount = 0;

// Listen for all archive data to be written
output.on("close", function () {
    const fileSize = archive.pointer();
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

    console.log("");
    console.log("========================================");
    logSuccess("✓ Success!");
    console.log("========================================");
    console.log("");
    console.log("autorun.zip created successfully at:");
    console.log(`  ${outputFile}`);
    console.log("");
    console.log(`File size: ${fileSizeMB} MB (${fileSize} bytes)`);
    console.log(`Files added: ${fileCount}`);
    console.log(`Directories: ${dirCount}`);
    console.log("");

    logInfo("Next steps:");
    console.log("1. Test the package locally on a BrightSign player");
    console.log("2. Host autorun.zip at a persistent HTTPS URL");
    console.log("3. Test using Player Setup -> App URL publishing mode");
    console.log("4. Contact BrightSign Partner team to add to Partner Gallery");
    console.log("");
    logWarning(
        "Important: Ensure your server uses HTTPS (required for Partner Gallery)"
    );
});

// Handle warnings
archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
        logWarning(`Warning: ${err.message}`);
    } else {
        throw err;
    }
});

// Handle errors
archive.on("error", function (err) {
    logError("========================================");
    logError("✗ Failed to create autorun.zip");
    logError("========================================");
    logError(err.message);
    process.exit(1);
});

// Track progress
archive.on("entry", function (entry) {
    if (entry.type === "directory") {
        dirCount++;
    } else if (entry.type === "file") {
        fileCount++;
    }
});

// Pipe archive data to the file
archive.pipe(output);

// Add files from setup-files directory
// Using glob pattern to exclude system files
archive.glob(
    "**/*",
    {
        cwd: setupFilesDir,
        dot: true, // Include .gitkeep files
        ignore: [
            "**/.DS_Store",
            "**/__MACOSX/**",
            "**/.git/**",
            "**/Thumbs.db",
        ],
    },
    {
        // Preserve empty directories
        nodir: false,
    }
);

// Finalize the archive
archive.finalize();
