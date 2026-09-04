const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");

const StorageClass = require("@brightsign/storage");
const RegistryClass = require("@brightsign/registry");
const DeviceInfoClass = require("@brightsign/deviceinfo");

const REGISTRY_SECTION = "crash_dump_example";
const UPLOAD_URL_REGISTRY_KEY = "upload_url";
const LAST_UPLOADED_DUMP_REGISTRY_KEY = "last_uploaded_dump"; // Stores the last successfully uploaded dump file and timestamp.
const DELETE_AFTER_UPLOAD = false; // Whether to delete the dump files from brightsign-dumps folder after upload.
const REQUEST_TIMEOUT_MS = 30000;
const rootPrefix = "/storage";

function getDefaultStorage() {
    let storageDeviceList = ["usb1", "sd", "sd2", "ssd"]; // default list
    try {
        const priorityOrder = new StorageClass().priorityOrder;
        if (Array.isArray(priorityOrder) && priorityOrder.length > 0) {
            storageDeviceList = priorityOrder.map((storagePath) =>
                path.relative(rootPrefix, storagePath)
            );
        }
    } catch {
        // Fall back to default list.
    }
    for (let index = 0; index < storageDeviceList.length; index += 1) {
        try {
            fs.realpathSync(path.join(rootPrefix, storageDeviceList[index]));
            return path.join(rootPrefix, storageDeviceList[index]);
        } catch {
            // The storage device is not present on this system.
        }
    }
    return undefined;
}

async function pathExists(filePath) {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

async function getUploadUrl() {
    const registry = new RegistryClass();
    const uploadUrl = await registry.read(
        REGISTRY_SECTION,
        UPLOAD_URL_REGISTRY_KEY
    );
    if (typeof uploadUrl === "string" && uploadUrl.trim() !== "") {
        return uploadUrl.trim();
    }

    throw new Error(
        `Missing registry value [${REGISTRY_SECTION}] ${UPLOAD_URL_REGISTRY_KEY}`
    );
}

async function loadConfig() {
    const storagePath = getDefaultStorage();
    if (!storagePath) {
        throw new Error(
            "Could not find a mounted BrightSign storage device under /storage"
        );
    }

    return {
        uploadUrl: await getUploadUrl(),
        storagePath,
        dumpsDir: path.join(storagePath, "brightsign-dumps"),
        deleteAfterUpload: DELETE_AFTER_UPLOAD,
        requestTimeoutMs: REQUEST_TIMEOUT_MS,
    };
}

async function loadLastUploadedDump() {
    try {
        const registry = new RegistryClass();
        const dumpText = await registry.read(
            REGISTRY_SECTION,
            LAST_UPLOADED_DUMP_REGISTRY_KEY
        );
        if (typeof dumpText !== "string" || dumpText.trim() === "") {
            return null;
        }

        const dump = JSON.parse(dumpText);
        if (!dump || typeof dump.modifiedTime !== "string") {
            return null;
        }
        return dump;
    } catch (error) {
        console.warn(
            `Could not read last uploaded dump from registry: ${error.message}`
        );
        return null;
    }
}

async function saveLastUploadedDump(dumpFile) {
    const registry = new RegistryClass();
    await registry.write(
        REGISTRY_SECTION,
        LAST_UPLOADED_DUMP_REGISTRY_KEY,
        JSON.stringify({
            relativePath: dumpFile.relativePath,
            size: dumpFile.size,
            modifiedTime: new Date(dumpFile.mtimeMs).toISOString(),
            uploadedAt: new Date().toISOString(),
        })
    );
}

async function findDumpFiles(dumpsDir) {
    if (!(await pathExists(dumpsDir))) {
        await fs.promises.mkdir(dumpsDir, { recursive: true });
        return [];
    }

    async function walk(dir) {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(
            entries.map(async (entry) => {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) return walk(fullPath);
                if (!entry.isFile()) return [];

                const stats = await fs.promises.stat(fullPath);
                return [
                    {
                        fullPath,
                        relativePath: path.relative(dumpsDir, fullPath),
                        size: stats.size,
                        mtimeMs: stats.mtimeMs,
                    },
                ];
            })
        );
        return files.flat();
    }

    return walk(dumpsDir);
}

function sortDumpFiles(dumpFiles) {
    return dumpFiles.sort((first, second) => {
        if (first.mtimeMs !== second.mtimeMs) {
            return first.mtimeMs - second.mtimeMs;
        }
        return first.relativePath.localeCompare(second.relativePath);
    });
}

function isNewerThanLastUploaded(dumpFile, lastUploadedDump) {
    if (!lastUploadedDump) return true;
    return new Date(dumpFile.mtimeMs) > new Date(lastUploadedDump.modifiedTime);
}

async function getDeviceInfo() {
    return new DeviceInfoClass();
}

function headersForDump(dumpFile, deviceInfo) {
    return {
        "Content-Type": "application/octet-stream",
        "Content-Length": dumpFile.size,
        DeviceId: deviceInfo.serialNumber || "unknown",
        DeviceModel: deviceInfo.model || "unknown",
        DeviceFwVersion: deviceInfo.osVersion || "unknown",
        DeviceUpTime: String(Math.round(deviceInfo.deviceUptime || 0)),
        CrashDump: "yes",
        DumpFileName: path.basename(dumpFile.fullPath),
        DumpRelativePath: dumpFile.relativePath,
        DumpSize: String(dumpFile.size),
        DumpModifiedTime: new Date(dumpFile.mtimeMs).toISOString(),
        Uploader: "post-crash-dumps-js-app",
    };
}

function uploadDump(uploadUrl, dumpFile, deviceInfo, requestTimeoutMs) {
    return new Promise((resolve, reject) => {
        const url = new URL(uploadUrl);
        const client = url.protocol === "https:" ? https : http;
        const request = client.request(
            url,
            {
                method: "POST",
                headers: headersForDump(dumpFile, deviceInfo),
                timeout: requestTimeoutMs,
            },
            (response) => {
                const chunks = [];
                response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
                response.on("end", () => {
                    const responseText = Buffer.concat(chunks).toString("utf8");
                    if (
                        response.statusCode &&
                        response.statusCode >= 200 &&
                        response.statusCode < 300
                    ) {
                        resolve();
                        return;
                    }
                    reject(
                        new Error(
                            `Server returned ${response.statusCode}: ${responseText}`
                        )
                    );
                });
            }
        );

        request.on("timeout", () => {
            request.destroy(
                new Error(`Request timed out after ${requestTimeoutMs}ms`)
            );
        });
        request.on("error", reject);

        fs.createReadStream(dumpFile.fullPath).pipe(request);
    });
}

async function processCrashDumps(config) {
    const deviceInfo = await getDeviceInfo();
    const dumpFiles = sortDumpFiles(await findDumpFiles(config.dumpsDir));
    const lastUploadedDump = await loadLastUploadedDump();
    const newDumpFiles = dumpFiles.filter((dumpFile) =>
        isNewerThanLastUploaded(dumpFile, lastUploadedDump)
    );

    console.log(
        `Found ${dumpFiles.length} dump file(s), ${newDumpFiles.length} new.`
    );

    let succeeded = 0;
    let failed = 0;

    for (const dumpFile of newDumpFiles) {
        try {
            console.log(
                `Uploading ${dumpFile.relativePath} to ${config.uploadUrl}`
            );
            await uploadDump(
                config.uploadUrl,
                dumpFile,
                deviceInfo,
                config.requestTimeoutMs
            );
            await saveLastUploadedDump(dumpFile);

            if (config.deleteAfterUpload) {
                await fs.promises.unlink(dumpFile.fullPath);
                console.log(`Uploaded and deleted ${dumpFile.relativePath}`);
            } else {
                console.log(`Uploaded ${dumpFile.relativePath}`);
            }
            succeeded += 1;
        } catch (error) {
            failed += 1;
            console.error(
                `Failed to upload ${dumpFile.relativePath}: ${error.message}`
            );
            break;
        }
    }

    console.log(
        `Crash dump upload complete. Uploaded: ${succeeded}. Failed: ${failed}.`
    );
    return failed === 0;
}

async function main() {
    const config = await loadConfig();
    console.log(`Crash dump directory: ${config.dumpsDir}`);
    console.log(`Upload endpoint: ${config.uploadUrl}`);
    console.log(`Delete after upload: ${config.deleteAfterUpload}`);

    const success = await processCrashDumps(config);
    if (!success) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error("Crash dump uploader failed:", error);
    process.exitCode = 1;
});
