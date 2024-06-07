#!/bin/bash

# This script bumps the version of every package to the current latest version in preparation for publishing to Github Packages

workspace_dirs=$(yarn workspaces --json info | jq -r '.data | fromjson | to_entries[] | .value.location')

for dir in $workspace_dirs; do
  pushd $dir
  echo "Current directory: $(pwd)"

  # add package registry configuration from setup-node at the root of the repo
  cp ../../.npmrc .npmrc

  npm version $GH_REF_VERSION
  
  popd
done
