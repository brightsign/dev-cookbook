/**
 * This script runs the specifed yarn commands only on workspaces that have changes
 * against the `main` branch.
 *
 * Usage: ./workspace_actions.js test format
 *
 */
const { execSync } = require("child_process");
const { existsSync } = require("fs");
const path = require("path");

const mainBranchName = "main"; // Adjust if your main branch has a different name
const commandsToRun = process.argv.slice(2); // Commands passed as arguments

// Calculate the monorepo root directory based on this script's location assuming it is in monorepo_root/scripts
const repoRoot = path.resolve(__dirname, "..");

function exec(command, captureOutput = false) {
    if (captureOutput) {
        return execSync(command).toString().trim();
    } else {
        execSync(command, { stdio: "inherit" });
    }
}

// Get a list of all workspaces and their paths
function getWorkspacesInfo() {
    const workspacesInfoRaw = exec(`yarn --cwd ${repoRoot} workspaces --json info`, true);
    try {
        // First, parse the JSON output to get the "data" field.
        const parsedOutput = JSON.parse(workspacesInfoRaw);
        // Then, parse the "data" field to get the actual workspaces info.
        const workspacesInfo = JSON.parse(parsedOutput.data);
        return Object.keys(workspacesInfo).reduce((acc, key) => {
            acc[key] = path.resolve(repoRoot, workspacesInfo[key].location);
            return acc;
        }, {});
    } catch (error) {
        console.error('Failed to parse workspaces info:', error);
        return {};
    }
}

// Get a list of changed files compared to the main branch
function getChangedFiles() {
    return exec(`git -C ${repoRoot} diff --name-only ${mainBranchName}`, true).split('\n');
  }

// Determine if a path is part of a workspace
function isPathInWorkspace(filePath, workspacePath) {
    const fullFilePath = path.resolve(repoRoot, filePath);
    const isInWorkspace = fullFilePath.startsWith(workspacePath);

    return isInWorkspace;
}

// Main function to run configurable commands in changed workspaces
function runCommandsInChangedWorkspaces() {
    const workspaces = getWorkspacesInfo();
    const changedFiles = getChangedFiles();
    const changedWorkspaces = {};

    // Determine which workspaces have changed
    for (const [workspace, workspacePath] of Object.entries(workspaces)) {
        if (
            changedFiles.some((file) => isPathInWorkspace(file, workspacePath))
        ) {
            changedWorkspaces[workspace] = workspacePath;
        }
    }

    // Run configurable commands in changed workspaces
    for (const [workspace, workspacePath] of Object.entries(
        changedWorkspaces
    )) {
        if (existsSync(`${workspacePath}/package.json`)) {
            for (const command of commandsToRun) {
                try {
                    exec(`cd ${workspacePath} && yarn ${command}`);
                } catch (error) {
                    console.error(
                        `Failed to run '${command}' in workspace: ${workspace}\n${error}`
                    );
                }
            }
        }
    }
}

runCommandsInChangedWorkspaces();
