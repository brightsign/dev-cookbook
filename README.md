# Introduction

Welcome to the BrightSign Dev Cookbook! Here you will find example code and projects for your BrightSign devices that demonstrate various capabilities. 

# Project structure

```
cra-template-*    # React templates
example-*         # Examples demonstrating different capabilities
.github/          # Github Actions configuration for build and deploy
scripts/          # Utility scripts for build and deploy
.eslintrc         # Lint configuration
package.json
```

# Prerequisites

We recommend managing your node.js version using `nvm`. The preferred version is `14.17.6`.

# Quickstart

```
# Install the correct node.js version
nvm install 14.17.6

# Clone the repo
git clone https://github.com/brightsign/dev-cookbook.git

# Use create-react-app
npx create-react-app bs-app --template file:./dev-cookbook/cra-template-brightsign-app

# Run the example locally
cd bs-app
yarn && yarn start

# (Optional) Push the example to your Brightsign device
PLAYER=your.device.ip.address PLAYER_PW=yourdeviceserialnumber yarn run put:prod 

```

# What are the cra-template-* examples?
They are React [Custom Templates](https://create-react-app.dev/docs/custom-templates/). They allow developers to quickly bootstrap a React application with custom code tailored to Brightsign development. 

COMING SOON: You can install any of our templates by running `npx create-react-app bs-app --template [template-name]`, without having to pull the `dev-cookbook` repo.

`cra-template-brightsign-app` is a minimal example of displaying a web app on a device. 

`cra-template-brightsign-dashboard` is a more complete example that leverages `@brightsign/` built-in packages to display device data.

# Feedback/Contributing

If you find any bugs or have suggestions for new examples, please let us know by opening an issue.

## Getting Started

This monorepo uses [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) to manage dependencies and run commands. Simply run `yarn install` from the workspace root and explore the examples!

To run the tests for every example, run `yarn workspaces run test` or the shortcut `yarn test`.

### Building on M1 Mac
You might see an error like `npm ERR! Error: Cannot find module 'node-bin-darwin-arm64/package.json'`

Run the following commands
```
> node -v
v14.17.6
> node -p process.arch
arm64
> arch -x86_64 zsh
> nvm uninstall 14.17.6 && nvm install 14.17.6
```

You might need to do this each time you restart your terminal.

https://stackoverflow.com/questions/68896696/having-trouble-installing-npm-on-mac-m1