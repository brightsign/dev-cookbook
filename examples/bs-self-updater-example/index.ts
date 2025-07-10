import fetch from "node-fetch";
import decompress from "decompress";
import md5File from "md5-file";
import fs from "fs";
import path from "path";

// @ts-ignore
import { System } from "@brightsign/system";

// Configurable values
const CHECK_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const SERVER_URL = "http://localhost:7000/autorun.zip"; // Update to your server URL
const STORAGE_PATH = "/storage/sd";
const TMP_PATH = "/storage/tmp";
const extensionsToCheck = [".brs", ".html", ".js", ".json"];

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function doesFileExist(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

async function downloadAndUnzipFile(
    url: string,
    dest: string
): Promise<boolean> {
    try {
        const res = await fetch(url);
        if (res.status === 200) {
            const buffer = Buffer.from(await res.arrayBuffer());
            await decompress(buffer, dest);
            console.log(`Downloaded and unzipped zip to ${dest}`);
            return true;
        } else {
            const err = await res.json();
            console.error(`Server error: ${JSON.stringify(err)}`);
            return false;
        }
    } catch (e) {
        console.error(`Download failed: ${e}`);
        return false;
    }
}

async function backupFiles(storagePath: string): Promise<void> {
    const filesToBackup = await findFiles(storagePath, extensionsToCheck);
    for (const file of filesToBackup) {
        const filename = file.replace(/^.*[\\/]/, "");
        const backupFile = path.join(TMP_PATH, filename);
        await fs.promises.copyFile(file, backupFile);
        console.log(`Backed up ${file} to ${backupFile}`);
    }
}

async function restoreFiles(storagePath: string): Promise<void> {
    const filesToRestore = await findFiles(TMP_PATH, extensionsToCheck);
    for (const file of filesToRestore) {
        const filename = file.replace(/^.*[\\/]/, "");
        const originalFile = path.join(storagePath, filename);
        await fs.promises.copyFile(file, originalFile);
        console.log(`Restored ${file} to ${originalFile}`);
    }
}

async function findFiles(dir: string, exts: string[]): Promise<string[]> {
    let results: string[] = [];
    const files = await fs.promises.readdir(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = await fs.promises.stat(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(await findFiles(fullPath, exts));
        } else if (exts.some((ext) => file.endsWith(ext))) {
            results.push(fullPath);
        }
    }
    return results;
}

async function checksum(filePath: string): Promise<string | null> {
    try {
        return await md5File(filePath);
    } catch {
        return null;
    }
}

async function reboot() {
    try {
        console.log("Rebooting device...");
        new System().reboot();
    } catch (e: any) {
        console.error("Failed to reboot:", e.message);
    }
}

async function processUpdate() {
    await backupFiles(STORAGE_PATH);

    const downloaded = await downloadAndUnzipFile(SERVER_URL, STORAGE_PATH);
    if (!downloaded) return;

    const autorunPath = path.join(STORAGE_PATH, "autorun.brs");
    if (!(await doesFileExist(autorunPath))) {
        console.error(
            "No autorun.brs script found after unzip. Restoring backup and rebooting."
        );
        await restoreFiles(STORAGE_PATH);
        await reboot();
        return;
    }

    const tmpFiles = await findFiles(TMP_PATH, extensionsToCheck);
    for (const file of tmpFiles) {
        const filename = file.replace(/^.*[\\/]/, "");
        const newFile = path.join(STORAGE_PATH, filename);
        if (await doesFileExist(newFile)) {
            const oldSum = await checksum(file);
            const newSum = await checksum(newFile);
            if (newSum !== oldSum) {
                console.log(`${file} changed. Rebooting.`);
                await reboot();
                return;
            }
        }
    }
}

async function main() {
    while (true) {
        try {
            await processUpdate();
        } catch (e) {
            console.error("Error in update loop:", e);
        }
        await sleep(CHECK_INTERVAL_MS);
    }
}

main();
