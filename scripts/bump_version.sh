#!/bin/bash

# This script bumps the version of every package to the current latest version in preparation for publishing to Github Packages

workspace_dirs=$(yarn workspaces --json info | jq -r '.data | fromjson | to_entries[] | .value.location')

for dir in $workspace_dirs; do
  pushd $dir
  echo "Current directory: $(pwd)"

  
  PACKAGE_NAME=$(jq -r '.name' package.json)
  
  # Run the GitHub API command to get the latest package version
  response=$(gh api orgs/brightsign/packages/npm/$PACKAGE_NAME/versions 2>/dev/null)
  if echo "$response" | jq -e '.message' >/dev/null; then
    # If there is an error message in the response, use the default version
    version_name="1.0.0"
    echo "Using default version 1.0.0 for $PACKAGE_NAME due to: $(echo "$response" | jq -r '.message')"
  else
    # Extract version name, if possible, otherwise use default
    version_name=$(echo "$response" | jq -r '.[0].name // "1.0.0"')
  fi

  # Update the package.json with the latest version 
  jq --indent 4 ".version = \"$version_name\"" package.json > temp.json && mv temp.json package.json
  
  popd
done
