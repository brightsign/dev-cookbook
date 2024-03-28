/**
 * This script runs the specifed yarn commands only on workspaces that have changes
 * against the `main` branch.
 * 
 * Usage: ./workspace_actions.js test format
 * 
 */
const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

const mainBranchName = 'main'; // Adjust if your main branch has a different name
const commandsToRun = process.argv.slice(2); // Commands passed as arguments

// Calculate the monorepo root directory based on this script's location assuming it is in monorepo_root/scripts
const repoRoot = path.resolve(__dirname, '..');

// Execute a command and return its output as a string
function exec(command) {
  return execSync(command, { stdio: 'inherit' }).toString().trim();
}

// Get a list of all workspaces and their paths
function getWorkspacesInfo() {
  const workspacesInfoRaw = exec(`yarn --cwd ${repoRoot} workspaces info --json`);
  const workspacesInfo = JSON.parse(JSON.parse(workspacesInfoRaw).data);
  return Object.keys(workspacesInfo).reduce((acc, key) => {
    acc[key] = path.resolve(repoRoot, workspacesInfo[key].location);
    return acc;
  }, {});
}

// Get a list of changed files compared to the main branch
function getChangedFiles() {
  return exec(`git -C ${repoRoot} diff --name-only ${mainBranchName}`).split('\n');
}

// Determine if a path is part of a workspace
function isPathInWorkspace(filePath, workspacePath) {
  return filePath.startsWith(workspacePath);
}

// Main function to run configurable commands in changed workspaces
function runCommandsInChangedWorkspaces() {
  const workspaces = getWorkspacesInfo();
  const changedFiles = getChangedFiles();
  const changedWorkspaces = {};

  // Determine which workspaces have changed
  for (const [workspace, workspacePath] of Object.entries(workspaces)) {
    if (changedFiles.some((file) => isPathInWorkspace(file, workspacePath))) {
      changedWorkspaces[workspace] = workspacePath;
    }
  }

  // Run configurable commands in changed workspaces
  for (const [workspace, workspacePath] of Object.entries(changedWorkspaces)) {
    if (existsSync(`${workspacePath}/package.json`)) {
      console.log(`Running commands in workspace: ${workspace} (${workspacePath})`);
      for (const command of commandsToRun) {
        try {
          exec(`cd ${workspacePath} && yarn ${command}`);
          console.log(`Successfully ran '${command}' in workspace: ${workspace}`);
        } catch (error) {
          console.error(`Failed to run '${command}' in workspace: ${workspace}\n${error}`);
        }
      }
    }
  }
}

runCommandsInChangedWorkspaces();
